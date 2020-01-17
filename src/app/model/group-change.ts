import {Group} from './group';
import {User} from './user';

export class GroupChange {

  id: number;
  group: Group;
  changeAuthor: User;
  changeDescription: string;
  changeTimestamp: Date;
}
