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

@Injectable({
  providedIn: 'root'
})
export class PomodoroService  {


  private user: User;
  private pomodoro: Pomodoro;
  public timer: Timer;


  constructor(private http: HttpClient, private userService: UserService, private webSocketService: RxStompService) {
this.initSocket();
  }


  public getLastPomodoro(): Observable<Pomodoro> {
    return this.http.post<any>(`http://localhost:8080/pomodoro/update`, '').pipe(map(pomodoro => {
      return pomodoro;
    }));
  }

  initSocket() {
    this.timer = new Timer();
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
          this.timer.start(this.pomodoro);
        });
        this.webSocketService.watch('/pomodoro/stop/' + this.user.username).subscribe(test => {
          this.timer.pause();
        });
        this.getLastPomodoro().pipe(first()).subscribe(
          pomodoro => {
            if (pomodoro!=null && !pomodoro.interrupted){
              this.pomodoro = pomodoro;
              this.timer.start(pomodoro);}
          }, error1 => {

          }
        );
      }
    );

  }


  startNewPomodoro() {
    this.webSocketService.publish({destination: '/app/start/' + this.user.username,});
  }

  resetPomodoro() {
    this.webSocketService.publish({destination: '/app/stop/' + this.user.username, body: JSON.stringify(this.pomodoro)},);
  }


}
