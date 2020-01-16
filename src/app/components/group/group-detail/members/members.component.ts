import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../../../model/user';
import {Timer} from '../../../../model/Timer';
import {first} from 'rxjs/operators';
import {UserServiceProvider} from '../../../../services/user-service-provider';
import {Group} from '../../../../model/group';
import {OnPhaseChanged} from '../../../../model/OnPhaseChanged';
import {Subscription} from 'rxjs';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit, OnDestroy, OnPhaseChanged {
  group: Group;
  user: User;
  @Input() groupName: string;
  isOwner: boolean = false;


  allUsers: Array<User>;
  private columnCount: number = 3;
  private workSelected: boolean = true;
  private pauseSelected: boolean = true;
  private notRunningSelected: boolean = true;
  private onPhaseChangedMonitor: OnPhaseChanged;

  private allRows: Map<User, Timer>;
  private filteredRows: Map<User, Timer>;


  private getNewGroupMemberSubscription: Subscription;

  constructor(private userServiceProvider: UserServiceProvider, private log: NGXLogger,) {
    this.fetchMembers();
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

  ngOnInit() {
  }

  private fetchMembers() {
    this.userServiceProvider.groupService.getGroups().subscribe((groups) => {
      this.group = groups.find((group) => group.name === this.groupName);
      this.isOwner = this.group.owner.username === this.user.username;
      this.allRows = new Map<User, Timer>();
      this.filteredRows = new Map<User, Timer>();
      this.userServiceProvider.groupService.getUsersForGroup(this.group.name).pipe(first()).subscribe(users => {
        this.allUsers = users;
        for (let i = 0; i < users.length; i++) {
          let user = users[i];

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

            }
          );
        }
      });
    });

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


  ngOnDestroy(): void {
    this.getNewGroupMemberSubscription.unsubscribe();
  }
}
