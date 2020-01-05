import {Group} from './group';
import {User} from './user';

export class GroupInvatation {
  id: number;
  group: Group;
  invitedUser: User;
  accepted: boolean;
}
