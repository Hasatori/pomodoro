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
import {NGXLogger} from 'ngx-logger';
import {ModalDirective} from 'angular-bootstrap-md';
import {$} from 'protractor';


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit, OnPhaseChanged {
  private group: Group;
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
  dataset;
  success: string;
  userError: string;
  groupError: string;
  isOwner: boolean = false;

  constructor(private route: ActivatedRoute, private groupService: GroupService, private webSocketService: RxStompService, private http: HttpClient, private pomodoroService: PomodoroService, private userService: UserService, private log: NGXLogger) {
    this.route.paramMap.subscribe(groupName => {
      this.reset();
      this.groupName = groupName.get('name');
      this.fetchMembers();
    });
  }

  private fetchMembers() {
    this.groupService.getGroups().subscribe((groups) => {
      this.group = groups.find((group) => group.name === this.groupName);

      console.log(this.group);
      this.userService.getUser().subscribe((user) => {
        this.user = user;
        this.isOwner=this.group.owner.username===this.user.username;
        this.allRows = new Map<User, Timer>();
        this.filteredRows = [];

        this.groupService.getUsersForGroup(this.groupName).pipe(first()).subscribe(users => {
          let row = new Map<User, Timer>();
          users = users.filter(user => user.username !== this.user.username);
          for (let i = 0; i < users.length; i++) {
            let user = users[i];
            console.log(user);
            this.groupService.getLastPomodoroForUser(user.username).pipe().subscribe(
              pomodoro => {
                let timer = new Timer(this.log, null, this);
                this.pomodoroService.watchStartingPomodoroForUser(user, timer);
                this.pomodoroService.watchStopingPomodoroForUser(user, timer);
                row.set(user, timer);
                this.allRows.set(user, timer);
                if (pomodoro != null) {
                  timer.start(pomodoro);
                }
                if (this.allRows.size === users.length) {
                  this.updateFilter();
                }
              }, error1 => {
                console.log(error1);
              }
            );
          }
        }, error => {
        });
      });
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


  public searchUsers(search: string) {
    if (!this.searchInProgress) {
      this.searchInProgress = true;
      console.log(search);
      setTimeout(() => {
        this.searchInProgress = false;
      }, this.searchDelayMilliseconds);

    }
  }

  public addUser(username: string) {
    this.reset();
    let check = false;
    this.allRows.forEach((value, key) => {
      if (key.username === username) {
        this.groupError = 'User already is part of the group';
        check = true;
      }
    });
    if (!check) {
      this.groupService.addUser(username, this.group.name).subscribe((response) => {

        this.groupService.emptyCache(this.group.name);
        this.fetchMembers();
        this.success = response.success;
      }, error1 => {
        this.userError = error1.error.username;
        this.groupError = error1.error.group;
      });
    }
  }

  public removeUser(user: User) {
    this.reset();
    this.groupService.removeUser(user.username, this.group.name).subscribe((response) => {

      this.groupService.emptyCache(this.group.name);
      this.fetchMembers();
      this.success = response.success;
    }, error1 => {
      this.userError = error1.error.username;
      this.groupError = error1.error.group;

    });
  }

  private reset() {
    this.success = null;
    this.userError = null;
    this.groupError = null;
  }
}
