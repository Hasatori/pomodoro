import {Message} from "./message";
import {User} from "../user/user";
import {Observable} from "rxjs/internal/Observable";

export interface Chat {
  name: string;
  threshold: number;
  limit: number;
  end: number;
  messages: Array<Message>;
  closeable: boolean;
  typingUsers: Array<User>;

  loadOlder(): void;

  sendMessage(value: String): void;

  editMessage(message: Message): void;

  reportIfCurrentUserIsTyping(isTyping: boolean): void
}
