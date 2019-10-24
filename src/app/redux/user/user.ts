import {Pomodoro} from '../pomodoro/pomodoro';
import {Group} from '../group/group';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  pomodoros?: Array<Pomodoro>;
  groups?: Array<Group>;
  token?: string;
}
