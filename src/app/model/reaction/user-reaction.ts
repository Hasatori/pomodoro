import {User} from '../user/user';
import {Message} from "../message/message";

export class UserReaction {
  author: User;
  messageId:number;
  readTimestamp: Date;
  emoji: Emoji;

}
