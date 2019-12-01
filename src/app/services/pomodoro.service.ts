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

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {


  private user: User;
  private pomodoro: Pomodoro;
  public timer: Timer;
  public PLAY_SOUND_KEY: string = 'playSound';
  private playSound: boolean;

  constructor(private http: HttpClient, private userService: UserService, private authService: AuthService, private webSocketService: RxStompService,private log:NGXLogger) {
  this.initSocket()

  }
public initSocket(){
  this.userService.getUser().pipe(first()).subscribe(
    user => {
      this.user = user;
      this.timer = new Timer(this.log,this.user.settings);
      this.log.debug(`Initializing socket for user { ${JSON.stringify(user)} }`);
      // create an empty headers object
      const headers = {};
      // make that CSRF token look like a real header
      headers['Authorization'] = this.authService.currentAccessTokenValue;
      // put the CSRF header into the connectHeaders on the config
      const config = {...webSocketConfig, connectHeaders: headers};
      this.webSocketService.configure(config);
      this.webSocketService.activate();
      this.watchStartingPomodoroForCurrentUser();
      this.watchStopingPomodoroForCurrentUser();
    }
  );
}

  public getLastPomodoro(): Observable<Pomodoro> {
    return this.http.post<any>(SERVER_URL + `/pomodoro/update`, '').pipe(map(pomodoro => {
      return pomodoro;
    }));
  }


  watchStartingPomodoroForUser(user: User, timer: Timer) {
    this.webSocketService.watch('/pomodoro/start/' + user.username).subscribe(response => {
      let pomodoro = JSON.parse(response.body);
      timer.start(pomodoro);
    });
  }

  watchStopingPomodoroForUser(user: User, timer: Timer) {
    this.webSocketService.watch('/pomodoro/stop/' + user.username).subscribe(test => {
      timer.pause();
    });
  }

  private watchStartingPomodoroForCurrentUser() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.timer = new Timer(this.log,user.settings);
      this.webSocketService.watch('/pomodoro/start/' + user.username).subscribe(response => {
        let pomodoro = JSON.parse(response.body);
        this.pomodoro=pomodoro;
        this.timer.start(pomodoro);
      });
    });
  }

  private watchStopingPomodoroForCurrentUser() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.timer = new Timer(this.log,user.settings);
      this.webSocketService.watch('/pomodoro/stop/' + user.username).subscribe(test => {
        this.timer.pause();
      });
    });
  }


  startPomodoroForUser(user: User) {
    this.webSocketService.publish({destination: '/app/start/' + user.username,});
  }

  resetPomodoroForUser(user: User, pomodoro: Pomodoro) {
    this.webSocketService.publish({destination: '/app/stop/' + user.username, body: JSON.stringify(pomodoro)},);
  }

  startPomodoroForCurrentUser() {
    this.webSocketService.publish({destination: '/app/start/' + this.user.username,});
  }

  resetPomodoroForCurrentUser() {
    this.webSocketService.publish({destination: '/app/stop/' + this.user.username, body: JSON.stringify(this.pomodoro)},);
  }
}
