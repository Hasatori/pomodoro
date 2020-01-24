import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserServiceProvider} from '../../../../../services/user-service-provider';
import {first, groupBy} from 'rxjs/operators';
import {User} from '../../../../../model/user';
import {GroupToDo} from '../../../../../model/GroupToDo';
import {IMyDate, IMyOptions, SelectComponent} from 'ng-uikit-pro-standard';
import {DatePipe} from '@angular/common';
import {ModalDirective} from 'angular-bootstrap-md';
import {isUndefined} from 'util';
import {Group} from '../../../../../model/group';

@Component({
  selector: 'app-create-edit-todo',
  templateUrl: './create-edit-todo.component.html',
  styleUrls: ['./create-edit-todo.component.scss']
})
export class CreateEditTodoComponent implements OnInit,AfterViewInit {
  title: string = '';
  groupToDo: GroupToDo = null;
  @Input() group: Group;
  @Input() users: Array<User>;
  @Input() user: User;
  // @ts-ignore
  @ViewChild('basicModal') input: ModalDirective;
shown:boolean=false;



  inProgress: boolean = false;
  success: string;
  elegantForm: FormGroup;

  assignedMembers: Array<any> = [];
  statuses: Array<any> = [
    {
      value: 0,
      label: 'Not started'
    },
    {
      value: 1,
      label: 'In progress'
    },
    {
      value: 2,
      label: 'Done',
    }

  ];
  selectedDate: string;

  constructor(public fb: FormBuilder, private userServiceProvider: UserServiceProvider, public datepipe: DatePipe) {
    this.elegantForm = this.fb.group({
      'assignUsersSelect': [],
      'statusSelect': [],
      'datePicker': [],
      'todoDescription': []
    });

  }

  ngOnInit() {


  }

  show(title: string, groupToDo?: GroupToDo) {
    this.groupToDo = new GroupToDo();
    this.assignedMembers = [];
    this.title = title;
    if (!isUndefined(groupToDo)) {
      this.groupToDo = groupToDo;
      this.elegantForm.controls.assignUsersSelect.setValue(this.groupToDo.assignedUsers.map(assignedUser => {
        return assignedUser.id;
      }));

      this.elegantForm.controls.statusSelect.setValue([this.statuses.find(status=>status.label.toUpperCase()===groupToDo.status.toUpperCase()).value]);
      this.selectedDate = this.datepipe.transform(new Date(this.groupToDo.deadline).getTime(), 'yyyy-MM-dd');
      let iconPath = '../../../../../../../assets/images/user.svg';
      this.users.forEach(user => {
        this.assignedMembers = [...this.assignedMembers, {
          value: user.id,
          label: user.username,
          icon: iconPath
        }];
      });

    }
    this.input.show();
  }

  onSave(description: string, status: number, deadline: IMyDate, assignedMembers: Array<number>) {
    this.groupToDo.groupId=this.group.id;
    this.groupToDo.authorId=this.user.id;
    this.groupToDo.description = description;
    this.groupToDo.status = this.statuses.find(status1 => status1.value === status).label;
    this.groupToDo.deadline = new Date(Date.parse(`${deadline.month} ${deadline.day} ${deadline.year}`));
    this.groupToDo.assignedUsers = this.users.filter(user => assignedMembers.some(memberId => {
      return memberId === user.id;
    }));
    this.userServiceProvider.webSocketProxyService.publish('/app/group/' + this.group.name + '/todos', JSON.stringify(this.groupToDo));
    this.input.hide();
  }

  ngAfterViewInit(): void {
    this.input.onShow.subscribe(()=>{
      this.shown=true;
    });
    this.input.onHide.subscribe(()=>{
      this.shown=false;
    })
  }
}
