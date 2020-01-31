import { Component, OnInit } from '@angular/core';
import {UserServiceProvider} from '../../../services/user-service-provider';
import {UserTodo} from '../../../model/user-todo';
import {GroupToDo} from '../../../model/GroupToDo';

@Component({
  selector: 'app-user-todo',
  templateUrl: './user-todo.component.html',
  styleUrls: ['./user-todo.component.scss']
})
export class UserTodoComponent implements OnInit {

  private userTodos:Array<UserTodo>=[];
  private allToDos: Array<UserTodo>=[];

  constructor(private userServiceProvider:UserServiceProvider) {
    userServiceProvider.userService.userTodos().subscribe(userTodos=>{
      this.allToDos = userTodos;
      for (let toDo of userTodos) {
        toDo.children = [];
        toDo.visible = false;
        toDo.selected = false;
        toDo.accordionDisabled = false;
        this.assignChildren(userTodos, toDo);
      }

    });


  }

  ngOnInit() {
  }

 assignChildren(allTodos: Array<UserTodo>, toDo: UserTodo) {
    toDo.children = toDo.children.concat(allTodos.filter(candidate => candidate.parent !== null && candidate.parent.id === toDo.id));
    if (toDo.parent === null) {

      this.userTodos.push(toDo);
    }
  }
}
