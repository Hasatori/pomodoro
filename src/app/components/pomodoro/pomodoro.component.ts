import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CountdownComponent, CountdownEvent, CountdownTimer} from 'ngx-countdown';
import {Pomodoro} from '../../model/pomodoro/pomodoro';
import {RxStompService, StompRService, StompService} from '@stomp/ng2-stompjs';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';
import {webSocketConfig} from '../../WebSocketConfig';
import {UserService} from '../../services/user.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss']
})
export class PomodoroComponent implements OnInit {

  private phase: string = 'WORK';
  @ViewChild('cd1') private countDown: CountdownComponent;
  private minutes: string;
  private seconds: string;
  private user: User;


  constructor(private webSocketService:RxStompService,private userService:UserService) {
    console.log(this.countDown)
    this.userService.getUser() .pipe(first()).subscribe(
      user => {
        this.user = user;
        // create an empty headers object
        const headers = {};


        // make that CSRF token look like a real header
        headers['Authorization'] = localStorage.getItem('accessToken');

        // put the CSRF header into the connectHeaders on the config
        const config = {...webSocketConfig, connectHeaders: headers};


        this.webSocketService.configure(config);

        this.webSocketService.activate();

        this.webSocketService.watch('/pomodoro/start/'+this.user.username).subscribe(test => {
         this.countDown.begin();
        });
        this.webSocketService.watch('/pomodoro/stop/'+this.user.username).subscribe(test => {
          this.countDown.pause();
      });
      }
    );

  }

  ngOnInit() {

  }

  handleEvent(event: CountdownEvent) {

  }

  startPomodoro() {
    var pomodoro = new Pomodoro();
    pomodoro.interrupted = false;
    this.webSocketService.publish({destination: '/app/start/'+this.user.username, body: JSON.stringify(pomodoro)});
  }
 stopPomodoro() {
    var pomodoro = new Pomodoro();
    pomodoro.interrupted = false;
    this.webSocketService.publish({destination: '/app/stop/'+this.user.username, body: JSON.stringify(pomodoro)});
  }
}
