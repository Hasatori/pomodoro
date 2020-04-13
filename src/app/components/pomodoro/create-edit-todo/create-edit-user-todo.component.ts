import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {User} from '../../../model/user/user';
import {ModalDirective} from 'angular-bootstrap-md';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserServiceProvider} from '../../../services/user-service-provider';
import {DatePipe} from '@angular/common';
import {isUndefined} from 'util';
import {IMyDate} from 'ng-uikit-pro-standard';
import {UserToDo} from "../../../model/to-do/user-to-do";
import {GroupToDo} from "../../../model/to-do/group-to-do";
@Component({
  selector: 'app-create-edit-user-todo',
  templateUrl: './create-edit-user-todo.component.html',
  styleUrls: ['./create-edit-user-todo.component.scss']
})
export class CreateEditUserTodoComponent implements OnInit {
  @Input() title: string = '';
  groupToDo: UserToDo = null;
  parents: Array<UserToDo> = [];
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
      'statusSelect': [],
      'datePicker': [],
      'todoDescription': []
    });

  }

  ngOnInit() {


  }

  show(title: string, parents?: Array<UserToDo>, userToDo?: UserToDo) {
    this.groupToDo = new GroupToDo();
    this.parents = parents === null || isUndefined(parents) ? [] : parents;
    this.assignedMembers = [];
    this.title = title;
    if (!isUndefined(userToDo)) {
      this.groupToDo = userToDo;
      this.elegantForm.controls.statusSelect.setValue([this.statuses.find(status => status.label.toUpperCase() === userToDo.status).value]);
      this.selectedDate = this.datepipe.transform(new Date(this.groupToDo.deadline).getTime(), 'yyyy-MM-dd');
    }
    this.input.show();
  }

  onSave(description: string, status: number, deadline: IMyDate) {
    this.groupToDo.author.id = this.user.id;
    this.groupToDo.description = description;
    this.groupToDo.status = this.statuses.find(status1 => status1.value === status).label;
    this.groupToDo.deadline = new Date(Date.parse(`${deadline.month} ${deadline.day} ${deadline.year}`));
    if (this.parents.length > 0) {
      this.parents.forEach(parentTask => {
        this.groupToDo.parentTask.id = parentTask.id;
        if (isUndefined(this.groupToDo.id)) {
          this.userServiceProvider.userService.addToDo(this.groupToDo);
        } else {
          this.userServiceProvider.userService.updateTodo(this.groupToDo);
        }
      });
    } else {
      if (isUndefined(this.groupToDo.id)) {
        this.userServiceProvider.userService.addToDo(this.groupToDo);
      } else {
        this.userServiceProvider.userService.updateTodo(this.groupToDo);
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
