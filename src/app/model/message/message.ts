import {User} from '../user/user';
import {UserReaction} from '../reaction/user-reaction';
import {MessageChange} from "../change/message-change";
import {MessageAttachment} from "../attachment/message-attachment";

export class Message {
  id: number;
  value: string;
  creationTimestamp: Date;
  author: User;
  repliedMessage:Message;
  changes: Array<MessageChange>;
  reactions: Array<UserReaction>;
  emojisGroupedReactions?:Map<Emoji,UserReaction[]>;
  attachments:Array<MessageAttachment>;
  currentUserReaction: UserReaction = null;
  shouldShowAuthorsName: boolean=null;
  shouldShowAuthorsPhoto: boolean=null;
  isCurrentUserAuthor:boolean=null;
}
