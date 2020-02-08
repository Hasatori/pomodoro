import {User} from './user';
import {Pomodoro} from './pomodoro';
import {GroupToDo} from './GroupToDo';

export class Group {
  id: number;
  name: string;
  owner: User;
  layoutImage?:string;
  created:Date;
  isPublic:boolean;
  description:string;
  groupTodos?:Array<GroupToDo>;
}
