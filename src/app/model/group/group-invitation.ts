import {Group} from './group';
import {User} from '../user/user';

export class GroupInvitation {
  id: number;
  group: Group;
  invitedUser: User;
  accepted: boolean;
  refused: boolean;
}
