import {User} from './user';
import {UserGroupMessage} from './user-group-message';
import {Reaction} from './reaction';

export class GroupMessage {
  author: User;
  value: string;
  timestamp: Date;
  relatedGroupMessages: Array<UserGroupMessage>;

  currentUserReaction?: string=null;
  reactions?: Array<Reaction> = new Array<Reaction>();
  shouldShowAuthorsName?: boolean;
  shouldShowAuthorsPhoto?: boolean;
}
