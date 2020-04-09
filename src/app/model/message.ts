import {User} from './user';
import {UserReaction} from './user-reaction';
import {Reaction} from './reaction';
import {GroupMessageChange} from './group-message-change';

export class Message {
  id: number;
  author: User;
  value: string;
  timestamp: Date;
  relatedGroupMessages: Array<UserReaction>;
  changes: Array<GroupMessageChange>;
  currentUserReaction?: string = null;
  reactions?: Array<Reaction> = new Array<Reaction>();
  shouldShowAuthorsName?: boolean;
  shouldShowAuthorsPhoto?: boolean;
  attachment?: string;
}
