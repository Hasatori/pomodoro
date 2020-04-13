import {Group} from '../group/group';
import {User} from '../user/user';
import {ToDo} from "./to-do";

export class UserToDo  extends ToDo{
  parentTask: UserToDo;
  children?: Array<UserToDo> = [];
}
