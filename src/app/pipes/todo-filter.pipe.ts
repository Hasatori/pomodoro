import {Pipe, PipeTransform} from '@angular/core';
import {isUndefined} from 'util';
import {GroupToDo} from "../model/to-do/group-to-do";
import {UserToDo} from "../model/to-do/user-to-do";


@Pipe({
  name: 'todoFilter'
})
export class TodoFilterPipe implements PipeTransform {

  transform(items: GroupToDo[] | UserToDo[], searchText: string): GroupToDo[] | UserToDo[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase().trim();
    return this.findTodo(items, searchText);

  }

  private findTodo(todos: Array<GroupToDo> | Array<UserToDo>, searchText: string): GroupToDo[] | UserToDo[] {
    let result = [];
    for (let todo of todos) {
      if (todo.name.toLowerCase().includes(searchText)) {
        result.push(todo);
      } else if (todo.description.toLowerCase().includes(searchText)) {
        result.push(todo);
      } else if (!isUndefined(todo.children) && todo.children !== null) {
        result = result.concat(this.findTodo(todo.children, searchText));
      }
    }
    return result;
  }
}
