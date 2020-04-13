import {User} from './user';


export class Pomodoro {
  user: User;
  creationTimestamp: Date;
  workDurationInSeconds: number;
  pauseDurationInSeconds: number;
  interrupted: boolean;
}
