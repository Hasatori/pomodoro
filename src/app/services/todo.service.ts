import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() { }

/*
  public assignChildren(allTodos: Array<GroupToDo>, toDo: GroupToDo,toAssing:Array<UserTodo>) {
    toDo.children = toDo.children.concat(allTodos.filter(candidate => candidate.parentTask !== null && candidate.parentTask.id === toDo.id));
    if (toDo.parentTask === null) {

      this.todos.push(toDo);
    }
  }
  */
}
