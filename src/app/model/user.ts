import {Pomodoro} from './pomodoro';
import {Group} from './group';
import {Settings} from './settings';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password:string;
  settings:Settings;
  pomodoros?: Array<Pomodoro>;
  groups?: Array<Group>;
  token?: string;


}
