import {User} from './user';
import {UserGroupMessage} from './user-group-message';
import {Reaction} from './reaction';
import {GroupMessageChange} from './group-message-change';

export class GroupMessage {
  id: number;
  author: User;
  value: string;
  timestamp: Date;
  relatedGroupMessages: Array<UserGroupMessage>;
  changes: Array<GroupMessageChange>;
  currentUserReaction?: string = null;
  reactions?: Array<Reaction> = new Array<Reaction>();
  shouldShowAuthorsName?: boolean;
  shouldShowAuthorsPhoto?: boolean;
  attachment?: string;
}
