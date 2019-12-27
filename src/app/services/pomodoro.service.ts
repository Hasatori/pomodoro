import {Injectable, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {User} from '../model/user';
import {Pomodoro} from '../model/pomodoro';
import {first, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {webSocketConfig} from '../WebSocketConfig';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Timer} from '../model/Timer';
import {AuthService} from './auth.service';
import {SERVER_URL} from '../ServerConfig';
import {Group} from '../model/group';
import {NGXLogger} from 'ngx-logger';
import {tree} from 'd3-hierarchy';
import {WebSocketProxyService} from './web-socket-proxy.service';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {

  private pomodoro: Pomodoro;
  public PLAY_SOUND_KEY: string = 'playSound';
  private playSound: boolean;
  public timer: Timer;
  public startedLocally: boolean = false;

  constructor(private webSocketProxyService:WebSocketProxyService,private http: HttpClient, private userService: UserService, private authService: AuthService, private log: NGXLogger) {
  }

  public init() {
    this.watchStartingPomodoroForCurrentUser();
    this.watchStopingPomodoroForCurrentUser();
    this.getLastPomodoro().pipe(first()).subscribe(pomodoro => {
      this.pomodoro = pomodoro;
      this.timer.start(this.pomodoro);
      console.log("test2");
    });
  }

  public getLastPomodoro(): Observable<Pomodoro> {
    return this.http.post<any>(SERVER_URL + `/pomodoro/update`, '').pipe(map(pomodoro => {
      return pomodoro;
    }));
  }


  watchStartingPomodoroForUser(user: User, timer: Timer) {

    this.webSocketProxyService.watch('/pomodoro/start/' + user.username).subscribe(response => {
      let pomodoro = JSON.parse(response.body);
      timer.start(pomodoro);
    });
  }

  watchStopingPomodoroForUser(user: User, timer: Timer) {
    this.webSocketProxyService.watch('/pomodoro/stop/' + user.username).subscribe(test => {
      timer.pause();
    });
  }

  private watchStartingPomodoroForCurrentUser() {
    this.userService.getUser().subscribe(user => {
      this.timer = new Timer(this.log, user.settings);
      this.webSocketProxyService.watch('/pomodoro/start/' + user.username).subscribe(response => {
        this.pomodoro = JSON.parse(response.body);
        this.timer.start(this.pomodoro);
      });
    });
  }

  private watchStopingPomodoroForCurrentUser() {
    this.userService.getUser().subscribe(user => {
      this.webSocketProxyService.watch('/pomodoro/stop/' + user.username).subscribe(test => {
        this.timer.pause();
      });
    });
  }


  startPomodoroForUser(user: User) {
    this.webSocketProxyService.publish( '/app/start/' + user.username);
  }

  resetPomodoroForUser(user: User, pomodoro: Pomodoro) {
    this.webSocketProxyService.publish('/app/stop/' + user.username,  JSON.stringify(pomodoro));
  }

  startPomodoroForCurrentUser() {
    this.startedLocally=true;
    this.userService.getUser().subscribe(user => {
      this.timer = new Timer(this.log, user.settings);
      this.webSocketProxyService.publish( '/app/start/' + user.username);
    });
  }

  resetPomodoroForCurrentUser() {
    this.startedLocally=false;
    this.userService.getUser().subscribe(user => {
      this.webSocketProxyService.publish( '/app/stop/' + user.username, JSON.stringify(this.pomodoro));
    });
  }
}
