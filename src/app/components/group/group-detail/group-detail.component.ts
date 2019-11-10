import {Component, ElementRef, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../../model/group';
import {GroupService} from '../../../services/group.service';
import {first, map} from 'rxjs/operators';
import {User} from '../../../model/user';
import {RxStompService} from '@stomp/ng2-stompjs';
import {webSocketConfig} from '../../../WebSocketConfig';
import {Timer} from '../../../model/Timer';
import {concat, Observable, pipe} from 'rxjs';
import {Pomodoro} from '../../../model/pomodoro';
import {HttpClient} from '@angular/common/http';
import {pipeFromArray} from 'rxjs/internal/util/pipe';
import {debounceTime, distinctUntilChanged, switchMapTo, takeUntil} from 'rxjs/operators';
import {observe} from 'rxjs-observe';
import {OnPhaseChanged} from '../../../model/OnPhaseChanged';
import {PomodoroService} from '../../../services/pomodoro.service';
import {UserService} from '../../../services/user.service';


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit, OnPhaseChanged {

  private groupName: string;
  private allRows: Map<User, Timer>;
  private filteredRows: Array<Map<User, Timer>>;
  private columnCount: number = 3;
  private workSelected: boolean = true;
  private pauseSelected: boolean = true;
  private notRunningSelected: boolean = true;
  private onPhaseChangedMonitor: OnPhaseChanged;
  private searchInProgress: boolean = false;
  private searchDelayMilliseconds: number = 500;
  private user: User;

  constructor(private route: ActivatedRoute, private groupService: GroupService, private webSocketService: RxStompService, private http: HttpClient, private pomodoroService: PomodoroService,private userService:UserService) {
    this.route.paramMap.subscribe(groupName => {
      userService.getUser().subscribe((user)=>{
        this.user=user;
        this.allRows = new Map<User, Timer>();
        this.filteredRows = [];
        this.groupName = groupName.get('name');
        this.groupService.getUsersForGroup(this.groupName).pipe(first()).subscribe(users => {
          let row = new Map<User, Timer>();
          users=users.filter(user=>user.username!==this.user.username);
          for (let i = 0; i < users.length; i++) {
            let user = users[i];
            this.groupService.getLastPomodoroForUser(user.username).pipe().subscribe(
              pomodoro => {
                let timer = new Timer(this);
                pomodoroService.watchStartingPomodoroForUser(user, timer);
                pomodoroService.watchStopingPomodoroForUser(user, timer);
                row.set(user, timer);
                this.allRows.set(user, timer);
                if (pomodoro != null) {
                  timer.start(pomodoro);
                }
                if (i == users.length) {
                  this.updateFilter();
                }
              }, error1 => {
                console.log(error1);
              }
            );
          }

        }, error => {
        });
      })
    });

  }

  ngOnInit() {

  }

  private select(input: HTMLInputElement) {
    let which = input.id;
    let selected = input.checked;
    console.log(selected);
    switch (which) {
      case 'WORK':
        this.workSelected = selected;
        break;
      case 'PAUSE':
        this.pauseSelected = selected;
        break;
      case 'NOT RUNNING':
        this.notRunningSelected = selected;
        break;

    }
    this.updateFilter();
  }

  private updateFilter() {

    this.filteredRows = [];
    let valuesToAdd = new Map<User, Timer>();
    if (this.workSelected === true) {
      this.addValues(valuesToAdd, 'WORK');
    }
    if (this.pauseSelected === true) {
      this.addValues(valuesToAdd, 'PAUSE');
    }
    if (this.notRunningSelected === true) {
      this.addValues(valuesToAdd, 'NOT RUNNING');
    }
    let count = 0;
    let row = new Map<User, Timer>();
    valuesToAdd.forEach((value, key) => {
      count++;
      row.set(key, value);
      if (row.size % this.columnCount === 0 || count == valuesToAdd.size) {
        this.filteredRows.push(row);
        row = new Map<User, Timer>();
      }

    });
  }

  private addValues(valuesToAdd: Map<User, Timer>, phase: string) {

    this.allRows.forEach((value, key) => {
      if (value.phase === phase) {
        valuesToAdd.set(key, value);
      }
    });
  }

  phaseChanged() {
    this.updateFilter();
  }

  public addUser() {

  }

  public removeUser() {

  }

  public searchUsers(search: string) {
    if (!this.searchInProgress) {
      this.searchInProgress = true;
      console.log(search);
      setTimeout(() => {
        this.searchInProgress = false;
      }, this.searchDelayMilliseconds);

    }
  }
}
