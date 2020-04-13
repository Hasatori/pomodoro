import {Injectable} from '@angular/core';
import {Timer} from '../model/user/timer';
import {NGXLogger} from 'ngx-logger';
import {Pomodoro} from '../model/user/pomodoro';

@Injectable({
  providedIn: 'root'
})
export class FreeTrialService {
  timer: Timer;
  pomodoro: Pomodoro;
  private DEFAULT_WORK_TIME:number=1500; //25 minutes
  private DEFAULT_BREAK_TIME:number=1500; //5 minutes

  constructor(private log: NGXLogger) {
    this.timer = new Timer();
  }

  public startPomodoro() {
    this.pomodoro = new Pomodoro();
    this.pomodoro.creationTimestamp = new Date();
    this.pomodoro.workDurationInSeconds = this.DEFAULT_WORK_TIME;
    this.pomodoro.pauseDurationInSeconds = this.DEFAULT_BREAK_TIME;
    this.timer.start(this.pomodoro);
  }
}
