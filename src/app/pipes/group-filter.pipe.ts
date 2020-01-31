import { Pipe, PipeTransform } from '@angular/core';
import {User} from '../model/user';
import {Group} from '../model/group';

@Pipe({
  name: 'groupFilter'
})
export class GroupFilterPipe implements PipeTransform {

  transform(items: Group[], searchText: string): Group[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase().trim();
      return items.filter(it => {
        return it.name.toLowerCase().includes(searchText);
      });
  }

}
