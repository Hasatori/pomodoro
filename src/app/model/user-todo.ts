import {Group} from './group';
import {User} from './user';

export class UserTodo {
  id: number;
  parent: UserTodo;
  parentId:number;
  author: User;
  authorId:number;
  status: string;
  deadline: Date;
  description: string;
  children?: Array<UserTodo> = [];
  visible?: boolean;
  selected?:boolean;
  accordionDisabled?:boolean;

}
