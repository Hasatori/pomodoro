import {User} from '../user/user';
import {Pomodoro} from '../pomodoro/pomodoro';

export class Group {
  id: number;
  name: string;
  owner: User;
}
