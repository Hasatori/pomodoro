import {Group} from "../group/group";
import {Message} from "./message";

export class GroupMessage extends Message {

  group: Group;
  repliedMessage: GroupMessage;
}
