import {Component, OnInit} from '@angular/core';
import {UserServiceProvider} from '../../../services/user-service-provider';
import {UserTodo} from '../../../model/user-todo';
import {isUndefined} from 'util';
import {CheckboxComponent} from 'ng-uikit-pro-standard';
import {map} from 'rxjs/operators';
import {User} from '../../../model/user';
import {select} from 'd3-selection';

@Component({
  selector: 'app-user-todo',
  templateUrl: './user-todo.component.html',
  styleUrls: ['./user-todo.component.scss']
})
export class UserTodoComponent implements OnInit {

  private userTodos: Array<UserTodo> = [];
  private allToDos: Array<UserTodo> = [];
  private loading: boolean = false;
  private deadlineTimeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  private anySelected = false;
  private selectedTodos: Array<UserTodo> = [];
  private user: User;

  constructor(private userServiceProvider: UserServiceProvider) {


  }

  ngOnInit() {
    this.loading = true;
    this.userServiceProvider.userService.userTodos().subscribe(userTodos => {
      this.allToDos = userTodos;
      for (let toDo of userTodos) {
        toDo.children = [];
        toDo.visible = true;
        toDo.selected = false;
        toDo.accordionDisabled = false;
        this.assignChildren(userTodos, toDo);
      }
      this.userServiceProvider.userService.getUser().subscribe(user => {
        this.user = user;
        this.loading = false;
        this.userServiceProvider.webSocketProxyService.watch('/user/' + user.username + '/todos').pipe(map(userToDo => {
          return JSON.parse(userToDo.body);
        })).subscribe(toDo => {
          this.allToDos = this.allToDos.filter(candidate => candidate.id !== toDo.id);
          this.allToDos.push(toDo);
          this.userTodos = [];
          for (let toDo of this.allToDos) {
            toDo.children = [];
            this.assignChildren(this.allToDos, toDo);
          }
        });
      });

    });


  }

  assignChildren(allTodos: Array<UserTodo>, toDo: UserTodo) {
    toDo.children = toDo.children.concat(allTodos.filter(candidate => candidate.parent !== null && candidate.parent.id === toDo.id));
    if (toDo.parent === null) {

      this.userTodos.push(toDo);
    }
  }

  getDeadlineFormat(todo: UserTodo): string {
    return new Date(todo.deadline).toLocaleDateString('en-US', this.deadlineTimeOptions);
  }

  todoOverdue(todo: UserTodo): boolean {
    let todoDeadlineMillis = new Date(todo.deadline).getTime();
    return Date.now() > todoDeadlineMillis;
  }

  select(item: UserTodo) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedTodos.push(item);
    } else {
      this.selectedTodos = this.selectedTodos.filter(todo => {
        return todo.id !== item.id;
      });
    }
    this.anySelected = this.isAnySelected(this.userTodos);
  }

  isAnySelected(todos: Array<UserTodo>): boolean {
    for (let todo of todos) {
      if (todo.selected) {
        return true;
      } else if (!isUndefined(todo.children)) {
        let childrenResult = this.isAnySelected(todo.children);
        if (childrenResult) {
          return true;
        }
      }
    }
    return false;
  }

  selectAll(checkbox: CheckboxComponent) {
    for (let todo of this.userTodos) {
      this.fillSelect(todo, checkbox.checked);
    }
    this.anySelected = checkbox.checked;
  }

  fillSelect(item: UserTodo, state: boolean) {
    item.selected = state;
    if (item.selected) {
      this.selectedTodos.push(item);
    } else {
      this.selectedTodos = this.selectedTodos.filter(todo => {
        return todo.id !== item.id;
      });
    }
    for (let child of item.children) {
      this.fillSelect(child, state);
    }

  }

  showOrHideToDo(toDo: UserTodo, popupShown: boolean) {
    if (!popupShown) {
      toDo.visible = !toDo.visible;
    }
  }

  removeTodosAndAllChildren(allTodos: Array<UserTodo>, todosToRemove: Array<UserTodo>): Array<UserTodo> {
    allTodos = allTodos.filter(candidate => !todosToRemove.some(todo => todo.id === candidate.id));
    todosToRemove.forEach(todoToRemove => {
      if (todoToRemove.children !== null) {
        this.removeTodosAndAllChildren(allTodos, todoToRemove.children);
      }
    });
    return allTodos;
  }

  removeTodos() {
    this.userServiceProvider.userService.removeTodos(this.selectedTodos).subscribe(
      response => {
        this.allToDos = this.removeTodosAndAllChildren(this.allToDos, this.selectedTodos);
        this.userTodos = [];
        for (let toDo of this.allToDos) {
          toDo.children = [];
          toDo.visible = false;
          toDo.selected = false;
          toDo.accordionDisabled = false;
          this.assignChildren(this.allToDos, toDo);
        }

      }
    );
  }
}
