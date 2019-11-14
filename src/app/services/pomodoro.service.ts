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

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {


  private user: User;
  private pomodoro: Pomodoro;
  public timer: Timer;


  constructor(private http: HttpClient, private userService: UserService, private webSocketService: RxStompService) {
    this.timer = new Timer(true);
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
        this.watchStartingPomodoroForUser(user, this.timer);
        this.watchStopingPomodoroForUser(user, this.timer);
        this.getLastPomodoro().pipe(first()).subscribe(
          pomodoro => {
            this.pomodoro = pomodoro;
            if (pomodoro != null && !pomodoro.interrupted) {
              var difference = (new Date() - new Date(pomodoro.creationTimestamp)) / 1000;
              if(difference < (pomodoro.workTime + pomodoro.breakTime)){
                this.resetPomodoroForCurrentUser();
              }
            }
          }, error1 => {

          }
        );
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
    console.log(this.pomodoro);
    this.webSocketService.publish({destination: '/app/stop/' + this.user.username, body: JSON.stringify(this.pomodoro)},);
  }
}
