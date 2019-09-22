import {Pomodoro} from '../pomodoro/pomodoro';
import {Group} from '../group/group';

export class User {
  firstName: string;
  secondName: string;
  email: string;
  pomodoros: Array<Pomodoro>;
  groups: Array<Group>;
}
