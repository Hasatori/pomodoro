import {Pomodoro} from './pomodoro';

export class Timer {

  public phase: string = 'NOT RUNNING';
  public minutes: string;
  public seconds: string;
  public secondsLeft: number;
  public interval;
  public timeLeft: string="00:00";
  public started: boolean = false;

  
  constructor() {
  }

  start(pomodoro:Pomodoro) {
    this.pause();
    // @ts-ignore
    var difference = (new Date() - new Date(pomodoro.creationTimestamp)) / 1000;
    if (pomodoro.interrupted) {
      this.phase = 'NOT RUNNING';
      this.secondsLeft = 0;
    } else if (difference > pomodoro.workTime) {
      this.started = true;
      this.secondsLeft = pomodoro.breakTime - (difference - pomodoro.workTime);
      this.phase = 'PAUSE';
    } else {
      this.started = true;
      this.phase = 'WORK';
      this.secondsLeft = pomodoro.workTime - difference;
    }
    let minutes;
    let seconds;
    console.log("started");
    this.interval = setInterval(() => {
      if (this.secondsLeft > 0) {
        // @ts-ignore

        var difference = (new Date() - new Date(pomodoro.creationTimestamp)) / 1000;
        if (difference > pomodoro.workTime && this.phase !== 'PAUSE') {
          this.secondsLeft = pomodoro.breakTime;
          this.phase = 'PAUSE';
        }
        this.secondsLeft--;
        minutes = Math.floor(this.secondsLeft / 60) % 60;
        seconds = Math.floor(this.secondsLeft - minutes * 60);
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        this.timeLeft = minutes + ':' + seconds;

      }else{
        this.pause();
      }


    }, 1000);
  }

  pause() {
    this.started = false;
    this.timeLeft = '00:00';
    this.phase='NOT RUNNING';
    clearInterval(this.interval);
  }
}
