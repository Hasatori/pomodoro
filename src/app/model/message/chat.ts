import {Message} from "./message";
import {User} from "../user/user";
import {Observable} from "rxjs/internal/Observable";
import {MessageAnswer} from "./message-answer";

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

  answerMessage(answerMessage: MessageAnswer): void;

  reportIfCurrentUserIsTyping(isTyping: boolean): void
}
