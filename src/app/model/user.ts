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
  pomodoroState?:PomodoroState=PomodoroState.NOT_RUNNING;

}

export enum PomodoroState{

  NOT_RUNNING,
  WORK,
  PAUSE
}
