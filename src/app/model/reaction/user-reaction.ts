import {User} from '../user/user';
import {Message} from "../message/message";

export class UserReaction {
  author: User;
  message: Message;
  readTimestamp: Date;
  emoji: Emoji;

}
