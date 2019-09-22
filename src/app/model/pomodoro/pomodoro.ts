import {User} from '../user/user';
import {TimeInterval} from 'rxjs';
import {Interval} from './interval';

export class Pomodoro {
  user: User;
  date: Date;
  workInterval: Interval;
  breakInteval: Interval;
  workTimeRemaining: Interval;
  breakTimeRemaining: Interval;
  interrupted: boolean;
  numberOfInterruptions: number;
}
