import {Component, ElementRef, Input, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../../model/group';
import {GroupService} from '../../../services/group.service';
import {first, map} from 'rxjs/operators';
import {User} from '../../../model/user';
import {RxStompService} from '@stomp/ng2-stompjs';
import {webSocketConfig} from '../../../WebSocketConfig';
import {Timer} from '../../../model/Timer';
import {concat, Observable, pipe, Subscription} from 'rxjs';
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
import {UserServiceProvider} from '../../../services/user-service-provider';


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit, OnPhaseChanged, OnDestroy {
  private group: Group;
  private groupName: string;
  private allRows: Map<User, Timer>;
  private filteredRows: Map<User, Timer>;
  private columnCount: number = 3;
  private workSelected: boolean = true;
  private pauseSelected: boolean = true;
  private notRunningSelected: boolean = true;
  private onPhaseChangedMonitor: OnPhaseChanged;
  private searchInProgress: boolean = false;
  private searchDelayMilliseconds: number = 500;
  private user: User;
  private invitedUsers: Array<User> = [];

  allUsers: Array<User>;
  dataset;
  success: string;
  userError: string;
  groupError: string;
  isOwner: boolean = false;
  membersVisible: boolean = false;
  private getNewGroupMemberSubscription: Subscription;

  constructor(private route: ActivatedRoute, private http: HttpClient, private log: NGXLogger, private userServiceProvider: UserServiceProvider) {
    this.route.paramMap.subscribe(groupName => {
      this.reset();
      this.groupName = groupName.get('name');
      this.fetchMembers();
    });
    this.getNewGroupMemberSubscription = this.userServiceProvider.groupService.getNewGroupMember(this.groupName).subscribe(user => {
      this.allUsers.push(user);
      let timer = new Timer(this.log, null, this);
      this.userServiceProvider.pomodoroService.watchStartingPomodoroForUser(user, timer);
      this.userServiceProvider.pomodoroService.watchStopingPomodoroForUser(user, timer);
      this.allRows.set(user, timer);
      this.userServiceProvider.groupService.getLastPomodoroForUser(user.username).pipe().subscribe(
        pomodoro => {
          let timer = new Timer(this.log, null, this);
          this.userServiceProvider.pomodoroService.watchStartingPomodoroForUser(user, timer);
          this.userServiceProvider.pomodoroService.watchStopingPomodoroForUser(user, timer);
          this.allRows.set(user, timer);
          if (pomodoro != null) {
            timer.start(pomodoro);
          }
          this.updateFilter();
        }, error1 => {
          console.log(error1);
        }
      );
    });
  }

  private fetchMembers() {
    this.userServiceProvider.groupService.getGroups().subscribe((groups) => {
      this.group = groups.find((group) => group.name === this.groupName);

      console.log(this.group);
      this.userServiceProvider.userService.getUser().subscribe((user) => {
        this.user = user;
        this.isOwner = this.group.owner.username === this.user.username;
        this.allRows = new Map<User, Timer>();
        this.filteredRows = new Map<User, Timer>();

        this.userServiceProvider.groupService.getUsersForGroup(this.groupName).pipe(first()).subscribe(users => {
          this.allUsers = users;
          users = users.filter(user => user.username !== this.user.username);
          for (let i = 0; i < users.length; i++) {
            let user = users[i];
            console.log(user);
            this.userServiceProvider.groupService.getLastPomodoroForUser(user.username).pipe().subscribe(
              pomodoro => {
                let timer = new Timer(this.log, null, this);
                this.userServiceProvider.pomodoroService.watchStartingPomodoroForUser(user, timer);
                this.userServiceProvider.pomodoroService.watchStopingPomodoroForUser(user, timer);
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

    this.filteredRows = new Map<User, Timer>();
    if (this.workSelected === true) {
      this.addValues(this.filteredRows, 'WORK');
    }
    if (this.pauseSelected === true) {
      this.addValues(this.filteredRows, 'PAUSE');
    }
    if (this.notRunningSelected === true) {
      this.addValues(this.filteredRows, 'NOT RUNNING');
    }

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

  public inviteUser(username: string) {
    this.reset();
    let check = false;
    this.allRows.forEach((value, key) => {
      if (key.username === username) {
        this.groupError = 'User has already been invited to the group';
        check = true;
      }
    });
    if (!check) {
      this.userServiceProvider.groupService.addUser(username, this.group.name);
      /*      this.userServiceProvider.groupService.addUser(username, this.group.name).subscribe((response) => {

              this.userServiceProvider.groupService.emptyCache(this.group.name);
              this.fetchMembers();
              this.success = response.success;
              let newUser = new User();
              newUser.username = username;
              this.invitedUsers.push(newUser);
            }, error1 => {
              this.userError = error1.error.username;
              this.groupError = error1.error.group;
            });*/
    }
  }

  public removeUser(user: User) {
    this.reset();
    this.userServiceProvider.groupService.removeUser(user.username, this.group.name).subscribe((response) => {

      this.userServiceProvider.groupService.emptyCache(this.group.name);
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

  ngOnDestroy(): void {
    this.getNewGroupMemberSubscription.unsubscribe();
  }
}
