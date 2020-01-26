import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../../../model/user';
import {Timer} from '../../../../model/Timer';
import {first} from 'rxjs/operators';
import {UserServiceProvider} from '../../../../services/user-service-provider';
import {Group} from '../../../../model/group';
import {OnPhaseChanged} from '../../../../model/OnPhaseChanged';
import {Subscription} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {CheckboxComponent, MdbCheckboxChange} from 'ng-uikit-pro-standard';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({
            transform: 'scale(0.5)', opacity: 0,
            height: '0px', margin: '0px'
          }))
      ])
    ]),
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(200, animateChild()))
      ]),
    ])
  ]
})
export class MembersComponent implements OnInit, OnDestroy, OnPhaseChanged {

  @Input() group: Group;
  @Input() user: User;
  @Input() isOwner: boolean;
  @Input() allUsers: Array<User>;

  private workSelected: boolean = true;
  private pauseSelected: boolean = true;
  private notRunningSelected: boolean = true;
  private allRows: Map<User, Timer>;
  private filteredRows: Map<User, Timer>;


  private getNewGroupMemberSubscription: Subscription;
  loading: boolean = false;

  constructor(private userServiceProvider: UserServiceProvider, private log: NGXLogger,) {
  }

  ngOnInit() {
    this.fetchMembers();
    this.getNewGroupMemberSubscription = this.userServiceProvider.groupService.getNewGroupMember(this.group.name).subscribe(user => {
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
    this.loading = true;
    this.allRows = new Map<User, Timer>();
    this.filteredRows = new Map<User, Timer>();
    this.allUsers = this.allUsers.filter(user => user.id !== this.user.id);
    for (let i = 0; i < this.allUsers.length; i++) {
      let user = this.allUsers[i];
      this.userServiceProvider.groupService.getLastPomodoroForUser(user.username).pipe().subscribe(
        pomodoro => {
          let timer = new Timer(this.log, null, this);
          this.userServiceProvider.pomodoroService.watchStartingPomodoroForUser(user, timer);
          this.userServiceProvider.pomodoroService.watchStopingPomodoroForUser(user, timer);
          this.allRows.set(user, timer);
          if (pomodoro != null) {
            timer.start(pomodoro);
          }
          if (this.allRows.size === this.allUsers.length) {
            this.updateFilter();
            this.loading = false;
          }
        }, error1 => {

        }
      );
    }
    if (this.allUsers.length==0){
      this.loading = false;
    }
  }

  private select(which:string,input: CheckboxComponent) {
    let selected = input.checked;
    console.log(which);
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
