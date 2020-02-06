import {Component, Input, OnInit} from '@angular/core';
import {UserServiceProvider} from '../../../../services/user-service-provider';
import {Group} from '../../../../model/group';
import {GroupToDo} from '../../../../model/GroupToDo';
import {select} from 'd3-selection';
import {CheckboxComponent} from 'ng-uikit-pro-standard';
import {isUndefined} from 'util';
import {map} from 'rxjs/operators';
import {User} from '../../../../model/user';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';
import {CreateEditGroupTodoComponent} from './create-edit-todo/create-edit-group-todo.component';
import {listAnimation, onCreateListAnimation} from "../../../../animations";

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss'],
  animations:[listAnimation,onCreateListAnimation]
})
export class ToDoListComponent implements OnInit {

  @Input() group: Group;
  @Input() users: Array<User>;
  user: User;
  public  todos: Array<GroupToDo> = [];
  public  allToDos: Array<GroupToDo> = [];
  private deadlineTimeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  public  anySelected = false;
  public  selectedTodos: Array<GroupToDo> = [];
  loading: boolean = true;

  constructor(public userServiceProvider: UserServiceProvider) {


  }

  ngOnInit() {
    this.loading = true;
    this.userServiceProvider.userService.getUser().subscribe(user => {
      this.user = user;
    });
    this.userServiceProvider.groupService.getGroupToDos(this.group.name).subscribe(todos => {
      this.allToDos = todos;
      for (let toDo of todos) {
        toDo.children = [];
        toDo.visible = true;
        toDo.selected = false;
        toDo.accordionDisabled = false;
        this.assignChildren(todos, toDo);
      }
      this.loading = false;
    });
    this.userServiceProvider.webSocketProxyService.watch('/group/' + this.group.name + '/todos').pipe(map(groupToDo => {
      return JSON.parse(groupToDo.body);
      ;
    })).subscribe(toDo => {
      this.allToDos = this.allToDos.filter(candidate => candidate.id !== toDo.id);
      this.allToDos.push(toDo);
      this.todos = [];
      for (let toDo of this.allToDos) {
        toDo.children = [];
        toDo.visible = true;
        toDo.selected = false;
        toDo.accordionDisabled = false;
        toDo.children = [];
        this.assignChildren(this.allToDos, toDo);
      }
    });
  }

  assignChildren(todos: Array<GroupToDo>, toDo: GroupToDo) {
    toDo.children = toDo.children.concat(todos.filter(candidate => candidate.parent !== null && candidate.parent.id === toDo.id));
    if (toDo.parent === null) {

      this.todos.push(toDo);
    }
  }

  showOrHideToDo(toDo: GroupToDo, popupShown: boolean) {
    if (!popupShown) {
      toDo.visible = !toDo.visible;
    }
  }

  select(item: GroupToDo) {
    /* if (item.selected && item.parent !== null) {

       let todo = this.findToDoWithId(this.todos, item.parent.id);
       if (todo.children.some(child => child.selected && child.id !== item.id)) {
         todo.selected = false;
       }

     } else if (!item.selected && item.parent !== null) {
       let todo = this.findToDoWithId(this.todos, item.parent.id);
       if (!todo.children.some(child => !child.selected && child.id !== item.id)) {
         todo.selected = true;
       }

     }*/
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedTodos.push(item);
    } else {
      this.selectedTodos = this.selectedTodos.filter(todo => {
        return todo.id !== item.id;
      });
    }
    this.anySelected = this.isAnySelected(this.todos);
    /*  let status = !item.selected;
      this.fillSelect(item, status);*/


  }

  isAnySelected(todos: Array<GroupToDo>): boolean {
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

  findToDoWithId(todos: Array<GroupToDo>, id: number): GroupToDo {
    let result = null;
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

  addGroupToDo() {
    let groupToDo = new GroupToDo();
    groupToDo.id = 7;
    groupToDo.groupId = this.group.id;
    groupToDo.authorId = this.user.id;
    groupToDo.status = 'TESddT';
    groupToDo.deadline = new Date();
    groupToDo.description = 'cqest';
    this.userServiceProvider.webSocketProxyService.publish('/app/group/' + this.group.name + '/todos', JSON.stringify(groupToDo));
  }

  todoOverdue(todo: GroupToDo): boolean {
    let todoDeadlineMillis = new Date(todo.deadline).getTime();
    return Date.now() > todoDeadlineMillis;
  }

  removeTodos() {
    this.userServiceProvider.groupService.removeGroupTodos(this.group, this.selectedTodos).subscribe(
      response => {
        this.allToDos = this.removeTodosAndAllChildren(this.allToDos, this.selectedTodos);
        this.todos = [];
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

  removeTodosAndAllChildren(allTodos: Array<GroupToDo>, todosToRemove: Array<GroupToDo>): Array<GroupToDo> {
    allTodos = allTodos.filter(candidate => !todosToRemove.some(todo => todo.id === candidate.id));
    todosToRemove.forEach(todoToRemove => {
      if (todoToRemove.children !== null) {
        this.removeTodosAndAllChildren(allTodos, todoToRemove.children);
      }
    });
    return allTodos;
  }

  selectOnlyMyTasks(checkbox: CheckboxComponent) {
    if (checkbox.checked) {

    }
  }
}
