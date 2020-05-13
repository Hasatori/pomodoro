import {Message} from "./message";

export interface Chat {
  name: string;
  threshold: number;
  limit: number;
  end: number;
  messages: Array<Message>;
  closeable: boolean;

  loadOlder(): void;

  sendMessage(value:String): void;

  editMessage(message:Message):void;
}
