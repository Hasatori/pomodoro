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
  private visitedTodos: Array<GroupToDo> = [];

  constructor(private userServiceProvider: UserServiceProvider) {


  }

  ngOnInit() {
    this.userServiceProvider.groupService.getGroupToDos(this.group.name).subscribe(todos => {
      for (let toDo of todos) {
        toDo.children = [];
        toDo.visible = true;
        toDo.selected = false;
        this.assignChildren(todos, toDo);
      }
      console.log(this.todos);
    });

  }

  assignChildren(todos: Array<GroupToDo>, toDo: GroupToDo) {
    toDo.children = toDo.children.concat(todos.filter(candidate => candidate.parent !== null && candidate.parent.id === toDo.id));
    if (toDo.parent === null) {
      this.todos.push(toDo);
    }
  }

  showOrHideToDo(toDo: GroupToDo) {
    toDo.visible = !toDo.visible;
  }

  select(item: GroupToDo) {
    if (item.selected && item.parent !== null) {

      let todo = this.findToDoWithId(this.todos, item.parent.id);
      if (!todo.children.some(child => child.selected&&child.id!==item.id)) {
        todo.selected = false;
      }

    } else if (!item.selected && item.parent !== null) {
      let todo = this.findToDoWithId(this.todos, item.parent.id);
      if (!todo.children.some(child => !child.selected&&child.id!==item.id)) {
        todo.selected = true;
      }

    }

    this.fillSelect(item);

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

  fillSelect(item: GroupToDo) {
    item.selected = !item.selected;
    for (let child of item.children) {
      this.fillSelect(child);
      console.log(item.selected);
    }

  }

  selectAll() {
    for (let todo of this.todos){
     this.fillSelect(todo);
    }
  }
}
