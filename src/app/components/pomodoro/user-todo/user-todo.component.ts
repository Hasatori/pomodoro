import {Component, OnInit} from '@angular/core';
import {UserServiceProvider} from '../../../services/user-service-provider';
import {isUndefined} from 'util';
import {CheckboxComponent} from 'ng-uikit-pro-standard';
import {map} from 'rxjs/operators';
import {User} from '../../../model/user/user';
import {listAnimation, onCreateListAnimation} from "../../../animations";
import {UserToDo} from "../../../model/to-do/user-to-do";

@Component({
  selector: 'app-user-todo',
  templateUrl: './user-todo.component.html',
  styleUrls: ['./user-todo.component.scss'],
animations:[listAnimation,onCreateListAnimation]
})
export class UserTodoComponent implements OnInit {

  public userTodos: Array<UserToDo> = [];
  public allToDos: Array<UserToDo> = [];
  public loading: boolean = false;
  public deadlineTimeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  public anySelected = false;
  public selectedTodos: Array<UserToDo> = [];
  public user: User;

  constructor(public userServiceProvider: UserServiceProvider) {


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
        this.userServiceProvider.webSocketProxyService.watch('/author/' + user.username + '/todos').pipe(map(userToDo => {
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

  assignChildren(allTodos: Array<UserToDo>, toDo: UserToDo) {
    toDo.children = toDo.children.concat(allTodos.filter(candidate => candidate.parentTask !== null && candidate.parentTask.id=== toDo.id));
    if (toDo.parentTask === null) {

      this.userTodos.push(toDo);
    }
  }

  getDeadlineFormat(todo: UserToDo): string {
    return new Date(todo.deadline).toLocaleDateString('en-US', this.deadlineTimeOptions);
  }

  todoOverdue(todo: UserToDo): boolean {
    let todoDeadlineMillis = new Date(todo.deadline).getTime();
    return Date.now() > todoDeadlineMillis;
  }

  select(item: UserToDo) {
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

  isAnySelected(todos: Array<UserToDo>): boolean {
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

  fillSelect(item: UserToDo, state: boolean) {
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

  showOrHideToDo(toDo: UserToDo, popupShown: boolean) {
    if (!popupShown) {
      toDo.visible = !toDo.visible;
    }
  }

  removeTodosAndAllChildren(allTodos: Array<UserToDo>, todosToRemove: Array<UserToDo>): Array<UserToDo> {
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
