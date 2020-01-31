import { Injectable } from '@angular/core';
import {GroupToDo} from '../model/GroupToDo';
import {UserTodo} from '../model/user-todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() { }

/*
  public assignChildren(allTodos: Array<GroupToDo>, toDo: GroupToDo,toAssing:Array<UserTodo>) {
    toDo.children = toDo.children.concat(allTodos.filter(candidate => candidate.parent !== null && candidate.parent.id === toDo.id));
    if (toDo.parent === null) {

      this.todos.push(toDo);
    }
  }
  */
}
