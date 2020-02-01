import {Pipe, PipeTransform} from '@angular/core';
import {Group} from '../model/group';
import {GroupToDo} from '../model/GroupToDo';
import {User} from '../model/user';
import {isUndefined} from 'util';

@Pipe({
  name: 'groupTodosFilter'
})
export class GroupTodosFilterPipe implements PipeTransform {

  transform(items: GroupToDo[], user: User, onlyMyTodos: boolean): GroupToDo[] {

    if (!items) {
      return [];
    }
    if (!onlyMyTodos || !user) {
      return items;
    }
    return this.findUserTodos(items, user);
  }

  private findUserTodos(todos: Array<GroupToDo>, user: User): GroupToDo[] {
    let result = [];
    for (let todo of todos) {
      if (todo.assignedUsers.some(assignedUser => assignedUser.id === user.id)) {
        result.push(todo);
      } else if (!isUndefined(todo.children) && todo.children !== null) {
        result = result.concat(this.findUserTodos(todo.children, user));
      }
    }
    return result;
  };

}
