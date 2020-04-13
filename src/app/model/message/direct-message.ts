import {User} from "../user/user";
import {Message} from "./message";

export class DirectMessage extends Message {
  recipient: User;
  repliedMessage: DirectMessage;
}
