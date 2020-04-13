import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import {UserServiceProvider} from '../../../../../services/user-service-provider';
import {User} from '../../../../../model/user/user';
import {IMyDate} from 'ng-uikit-pro-standard';
import {DatePipe} from '@angular/common';
import {ModalDirective} from 'angular-bootstrap-md';
import {Group} from '../../../../../model/group/group';
import {isUndefined} from 'util';
import {GroupToDo} from "../../../../../model/to-do/group-to-do";

@Component({
  selector: 'app-create-edit-group-todo',
  templateUrl: './create-edit-group-todo.component.html',
  styleUrls: ['./create-edit-group-todo.component.scss']
})
export class CreateEditGroupTodoComponent implements OnInit, AfterViewInit {
  @Input()
  title: string = '';
  groupToDo: GroupToDo = null;
  parents: Array<GroupToDo> = [];
  @Input() group: Group;
  @Input() users: Array<User>;
  @Input() user: User;
  // @ts-ignore
  @ViewChild('basicModal') input: ModalDirective;
  shown: boolean = false;


  inProgress: boolean = false;
  success: string;
  elegantForm: FormGroup;

  assignedMembers: Array<any> = [];
  statuses: Array<any> = [
    {
      value: 1,
      label: 'Not started'
    },
    {
      value: 2,
      label: 'In progress'
    },
    {
      value: 3,
      label: 'Done',
    }
  ];
  selectedDate: string;

  constructor(public fb: FormBuilder, public userServiceProvider: UserServiceProvider, public datepipe: DatePipe) {
    this.elegantForm = this.fb.group({
      'assignUsersSelect': [],
      'statusSelect': [],
      'datePicker': [],
      'todoDescription': []
    });

  }

  ngOnInit() {


  }

  show(title: string, parents?: Array<GroupToDo>, groupToDo?: GroupToDo) {
    this.groupToDo = new GroupToDo();
    this.parents=parents===null|| isUndefined(parents)?[]:parents;
    this.assignedMembers = [];
    this.title = title;
    if (!isUndefined(groupToDo)) {
      this.groupToDo = groupToDo;
      this.elegantForm.controls.assignUsersSelect.setValue(this.groupToDo.assignedUsers.map(assignedUser => {
        return assignedUser.id;
      }));

      this.elegantForm.controls.statusSelect.setValue([this.statuses.find(status => status.label.toUpperCase() === groupToDo.status).value]);
      this.selectedDate = this.datepipe.transform(new Date(this.groupToDo.deadline).getTime(), 'yyyy-MM-dd');
      let iconPath = '../../../../../../../assets/images/author.svg';
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
    let oldTodo=Object.assign({},this.groupToDo);
    this.groupToDo.id = this.group.id;
    this.groupToDo.id = this.user.id;
    this.groupToDo.description = description;
    this.groupToDo.status = this.statuses.find(status1 => status1.value === status).label;
    this.groupToDo.deadline = new Date(Date.parse(`${deadline.month} ${deadline.day} ${deadline.year}`));
    this.groupToDo.assignedUsers = this.users.filter(user => assignedMembers.some(memberId => {
      return memberId === user.id;
    }));
    if (this.parents.length>0){
      this.parents.forEach(parent=>{
        this.groupToDo.parentTask.id=parent.id;
        if (isUndefined(this.groupToDo.id)){
          this.userServiceProvider.groupService.addToDo(this.group,this.groupToDo);
        } else{
          this.userServiceProvider.groupService.updateTodo(this.group,oldTodo,this.groupToDo)
        }
      });
    }else{
      if (isUndefined(this.groupToDo.id)){
        this.userServiceProvider.groupService.addToDo(this.group,this.groupToDo);
      } else{
        this.userServiceProvider.groupService.updateTodo(this.group,oldTodo,this.groupToDo)
      }
    }
    this.input.hide();
  }

  ngAfterViewInit(): void {
    this.input.onShow.subscribe(() => {
      this.shown = true;
    });
    this.input.onHide.subscribe(() => {
      this.shown = false;
    });
  }
}
