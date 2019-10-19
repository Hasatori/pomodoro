import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../../model/group/group';
import {GroupService} from '../../../services/group.service';
import {first, map} from 'rxjs/operators';
import {User} from '../../../model/user/user';
import {RxStompService} from '@stomp/ng2-stompjs';
import {webSocketConfig} from '../../../WebSocketConfig';
import {Timer} from '../../../model/pomodoro/Timer';
import {concat, Observable, pipe} from 'rxjs';
import {Pomodoro} from '../../../model/pomodoro/pomodoro';
import {HttpClient} from '@angular/common/http';
import {pipeFromArray} from 'rxjs/internal/util/pipe';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {

  private groupName: string;
  private rows: Array<Map<User, Timer>>;
  private columnCount: number = 3;

  constructor(private route: ActivatedRoute, private groupService: GroupService, private webSocketService: RxStompService, private http: HttpClient) {

    this.route.paramMap.subscribe(groupName => {
      this.rows = [];
      this.groupName = groupName.get('name');
      this.groupService.getUsersForGroup(this.groupName).pipe(first()).subscribe(users => {
        let row = new Map<User, Timer>();
        for (let i = 0; i < users.length; i++) {
          let user = users[i];
          this.groupService.getLastPomodoroForUser(user.username).pipe().subscribe(
            pomodoro => {
              let timer = new Timer();
              this.webSocketService.watch('/pomodoro/start/' + user.username).subscribe(response => {
                let pomodoro = JSON.parse(response.body);
                timer.start(pomodoro);
              });
              this.webSocketService.watch('/pomodoro/stop/' + user.username).subscribe(response => {
                timer.pause();
              });
              row.set(user, timer);
              if (pomodoro != null) {
                timer.start(pomodoro);
              }
              if (row.size==this.columnCount) {
                this.rows.push(row);
                row = new Map<User, Timer>();
              }
            }, error1 => {
              console.log(error1);
            }
          );
        }

      }, error => {
      });
    });

  }

  ngOnInit() {

  }


}
