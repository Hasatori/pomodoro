import {User} from '../user/user';


export class Pomodoro {
  user: User;
  creationTimestamp: Date;
  workTime: number;
  breakTime: number;
  interrupted: boolean;
}
