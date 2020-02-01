import {Pipe, PipeTransform} from '@angular/core';
import {GroupToDo} from '../model/GroupToDo';
import {User} from '../model/user';
import {isUndefined} from 'util';


@Pipe({
  name: 'todoFilter'
})
export class TodoFilterPipe implements PipeTransform {

  transform(items: GroupToDo[], searchText: string): GroupToDo[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase().trim();
    return this.findTodo(items, searchText);

  }

  private findTodo(todos: Array<GroupToDo>, searchText: string): GroupToDo[] {
    let result = [];
    for (let todo of todos) {
      if (todo.description.toLowerCase().includes(searchText)) {
        result.push(todo);
      } else if (!isUndefined(todo.children) && todo.children !== null) {
        result = result.concat(this.findTodo(todo.children, searchText));
      }
    }
    return result;
  };
}
