import { Pipe, PipeTransform } from '@angular/core';
import {Group} from '../model/group';
import {GroupInvitation} from '../model/group-invitation';

@Pipe({
  name: 'invitationFilter'
})
export class InvitationFilterPipe implements PipeTransform {
  transform(items: GroupInvitation[], searchText: string): GroupInvitation[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase().trim();
    return items.filter(it => {
      return it.group.name.toLowerCase().includes(searchText)
        || it.group.owner.username.toLowerCase().includes(searchText);
    });
  }

}

