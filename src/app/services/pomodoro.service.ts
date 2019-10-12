import {Injectable, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {User} from '../model/user/user';
import {Pomodoro} from '../model/pomodoro/pomodoro';
import {first, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {webSocketConfig} from '../WebSocketConfig';
import {RxStompService} from '@stomp/ng2-stompjs';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService implements OnInit {

  public phase: string = 'WORK';
  private minutes: string;
  private seconds: string;
  private user: User;
  private pomodoro: Pomodoro;
  private secondsLeft: number;
  public timeLeft: string;
  private interval;
  public started: boolean = false;

  constructor(private http: HttpClient, private userService: UserService, private webSocketService: RxStompService) {
    this.userService.getUser().pipe(first()).subscribe(
      user => {
        this.user = user;
        // create an empty headers object
        const headers = {};
        // make that CSRF token look like a real header
        headers['Authorization'] = localStorage.getItem('accessToken');
        // put the CSRF header into the connectHeaders on the config
        const config = {...webSocketConfig, connectHeaders: headers};
        this.webSocketService.configure(config);
        this.webSocketService.activate();
        this.webSocketService.watch('/pomodoro/start/' + this.user.username).subscribe(response => {
          this.pomodoro = JSON.parse(response.body);
          this.startPomodoro();
        });
        this.webSocketService.watch('/pomodoro/stop/' + this.user.username).subscribe(test => {
          this.pauseTimer();
        });
        this.getLastPomodoro().pipe(first()).subscribe(
          pomodoro => {
            this.pomodoro = pomodoro;
            this.startPomodoro();
          }, error1 => {

          }
        );
      }
    );
  }


  public getLastPomodoro(): Observable<Pomodoro> {
    return this.http.post<any>(`http://localhost:8080/pomodoro/update`, '').pipe(map(pomodoro => {
      return pomodoro;
    }));
  }

  ngOnInit() {

  }


  startPomodoro() {
    this.pauseTimer();
    // @ts-ignore
    var difference = (new Date() - new Date(this.pomodoro.creationTimestamp)) / 1000;
    if (this.pomodoro.interrupted) {
      this.phase = 'WORK';
      this.secondsLeft = 0;
    } else if (difference > this.pomodoro.workTime) {
      this.started = true;
      this.secondsLeft = this.pomodoro.breakTime - (difference - this.pomodoro.workTime);
      this.phase = 'PAUSE';
    } else {
      this.started = true;
      this.phase = 'WORK';
      this.secondsLeft = this.pomodoro.workTime - difference;
    }
    this.startTimer();
  }

  startNewPomodoro() {
    this.webSocketService.publish({destination: '/app/start/' + this.user.username,});
  }

  resetPomodoro() {
    this.webSocketService.publish({destination: '/app/stop/' + this.user.username, body: JSON.stringify(this.pomodoro)},);
  }

  startTimer() {
    let minutes;
    let seconds;
    this.interval = setInterval(() => {
      if (this.secondsLeft > 0) {
        // @ts-ignore
        var difference = (new Date() - new Date(this.pomodoro.creationTimestamp)) / 1000;
        if (difference > this.pomodoro.workTime && this.phase !== 'PAUSE') {
          this.secondsLeft = this.pomodoro.breakTime;
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
      }
    }, 1000);
  }

  pauseTimer() {
    this.started = false;
    this.timeLeft = '00:00';
    clearInterval(this.interval);
  }
}
