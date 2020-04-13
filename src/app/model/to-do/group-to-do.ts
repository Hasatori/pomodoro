import {Group} from '../group/group';
import {User} from '../user/user';
import {ToDo} from "./to-do";

export class GroupToDo  extends ToDo{
  assignedUsers: Array<User>;
  group:Group;
  parentTask: GroupToDo;
  children?: Array<GroupToDo> = [];

}
