import {User} from '../user/user';
import {Pomodoro} from '../user/pomodoro';
import {GroupMessage} from "../message/group-message";
import {GroupInvitation} from "./group-invitation";
import {GroupChange} from "../change/group-change";
import {GroupToDo} from "../to-do/group-to-do";

export class Group {
  id: number;
  name: string;
  isPublic: boolean;
  creationTimestamp: Date;
  layoutImage: string;
  description: string;
  owner: User;
  users?: Array<User>;
  groupMessages?:Array<GroupMessage>;
  groupInvitations?:Array<GroupInvitation>;
  groupChanges?:Array<GroupChange>;
  groupTodos?: Array<GroupToDo>;
}
