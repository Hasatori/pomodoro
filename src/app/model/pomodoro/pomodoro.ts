import {User} from '../user/user';


export class Pomodoro {
  user: User;
  date: Date;
  workTimeRemaining: number;
  breakTimeRemaining: number;
  interrupted: boolean;
  numberOfInterruptions: number;
}
