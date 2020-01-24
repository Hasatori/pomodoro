import {Group} from './group';
import {User} from './user';

export class GroupToDo {
  id: number;
  group:Group;
  groupId:number;
  parent: GroupToDo;
  parentId:number;
  author: User;
  authorId:number;
  status: string;
  deadline: Date;
  description: string;
  assignedUsers: Array<User>;
  children?: Array<GroupToDo> = [];
  visible?: boolean;
  selected?:boolean;
  accordionDisabled?:boolean;

}
