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
import {CreateEditTodoComponent} from './create-edit-todo/create-edit-todo.component';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({transform: 'scale(0.5)', opacity: 0}),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({transform: 'scale(1)', opacity: 1}))  // final
      ]),
    ]),
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(200, animateChild()))
      ]),
    ])
  ]
})
export class ToDoListComponent implements OnInit {

  @Input() group: Group;
  @Input() users: Array<User>;
  user: User;
  private todos: Array<GroupToDo> = [];
  private allToDos: Array<GroupToDo> = [];
  private deadlineTimeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  private anySelected = false;

  constructor(private userServiceProvider: UserServiceProvider) {


  }

  ngOnInit() {
    this.userServiceProvider.userService.getUser().subscribe(user => {
      this.user = user;
    });
    this.userServiceProvider.groupService.getGroupToDos(this.group.name).subscribe(todos => {
      this.allToDos = todos;
      for (let toDo of todos) {
        toDo.children = [];
        toDo.visible = false;
        toDo.selected = false;
        toDo.accordionDisabled = false;
        this.assignChildren(todos, toDo);
      }
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

  showOrHideToDo(toDo: GroupToDo,popupShown:boolean) {
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


}
