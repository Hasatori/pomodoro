import {Pomodoro} from './pomodoro';
import {Group} from '../group/group';
import {Settings} from './settings';
import {PomodoroState} from "./pomodoro-state";
import {GroupInvitation} from "../group/group-invitation";
import {DirectMessage} from "../message/direct-message";
import {UserReaction} from "../reaction/user-reaction";
import {UserToDo} from "../to-do/user-to-do";
import {GroupToDo} from "../to-do/group-to-do";

export class User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password:string;
  settings: Settings;
  memberOfGroups?: Array<Group>;
  ownedGroups?: Array<Group>;
  pomodoros?: Array<Pomodoro>;
  groupInvitations?: Array<GroupInvitation>;
  directMessages?: Array<DirectMessage>;
  reactions?: Array<UserReaction>;
  userToDos?: Array<UserToDo>;
  groupToDos?: Array<GroupToDo>;
  pomodoroState?: PomodoroState = PomodoroState.NOT_RUNNING;
}
