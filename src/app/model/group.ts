import {User} from './user';
import {Pomodoro} from './pomodoro';

export class Group {
  id: number;
  name: string;
  owner: User;
  layoutImagePath?:string;
  created:Date;
}
