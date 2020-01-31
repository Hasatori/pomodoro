import {Pipe, PipeTransform} from '@angular/core';
import {User} from '../model/user';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(items: User[], searchText: string): User[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase().trim();
    if (searchText !== '') {
      return items.filter(it => {
        return it.username.toLowerCase().includes(searchText);
      });
    } else {
      return [];
    }

  }


}
