import {Group} from './group';
import {User} from './user';

export class GroupInvitation {
  id: number;
  group: Group;
  invitedUser: User;
  accepted: boolean;
}
