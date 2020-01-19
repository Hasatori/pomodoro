import {Component, Input, OnInit} from '@angular/core';
import {UserServiceProvider} from '../../../../services/user-service-provider';
import {Group} from '../../../../model/group';
import {GroupToDo} from '../../../../model/GroupToDo';
import {select} from 'd3-selection';
import {CheckboxComponent} from 'ng-uikit-pro-standard';
import {isUndefined} from 'util';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent implements OnInit {

  @Input() group: Group;

  private todos: Array<GroupToDo> = [];
  private deadlineTimeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  private anySelected = false;

  constructor(private userServiceProvider: UserServiceProvider) {


  }

  ngOnInit() {
    this.userServiceProvider.groupService.getGroupToDos(this.group.name).subscribe(todos => {
      for (let toDo of todos) {
        toDo.children = [];
        toDo.visible = true;
        toDo.selected = false;
        toDo.accordionDisabled = false;
        this.assignChildren(todos, toDo);
      }
    });

  }

  assignChildren(todos: Array<GroupToDo>, toDo: GroupToDo) {
    toDo.children = toDo.children.concat(todos.filter(candidate => candidate.parent !== null && candidate.parent.id === toDo.id));
    if (toDo.parent === null) {
      this.todos.push(toDo);
    }
  }

  showOrHideToDo(toDo: GroupToDo) {
    if (!toDo.accordionDisabled) {
      toDo.visible = !toDo.visible;
    }
  }

  select(item: GroupToDo) {
    if (item.selected && item.parent !== null) {

      let todo = this.findToDoWithId(this.todos, item.parent.id);
      if (todo.children.some(child => child.selected && child.id !== item.id)) {
        todo.selected = false;
      }

    } else if (!item.selected && item.parent !== null) {
      let todo = this.findToDoWithId(this.todos, item.parent.id);
      if (!todo.children.some(child => !child.selected && child.id !== item.id)) {
        todo.selected = true;
      }

    }
    let status = !item.selected;
    this.fillSelect(item, status);

  }

  findToDoWithId(todos: Array<GroupToDo>, id: number): GroupToDo {
    let result;
    for (let todo of todos) {
      if (todo.id === id) {
        result = todo;
        break;
      } else if (!isUndefined(todo.children)) {
        result = this.findToDoWithId(todo.children, id);
      }
      if (result.id === id) {
        break;
      }
    }
    return result;
  }

  fillSelect(item: GroupToDo, state: boolean) {
    item.selected = state;
    for (let child of item.children) {
      this.fillSelect(child, state);
    }

  }

  selectAll(checkbox: CheckboxComponent) {
    for (let todo of this.todos) {
      this.fillSelect(todo, checkbox.checked);
    }
  }

  getDeadlineFormat(todo: GroupToDo): string {
    return new Date(todo.deadline).toLocaleDateString('en-US', this.deadlineTimeOptions);
  }


}
