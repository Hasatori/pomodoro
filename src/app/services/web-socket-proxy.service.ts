import {Injectable} from '@angular/core';
import {first} from 'rxjs/operators';
import {webSocketConfig} from '../WebSocketConfig';
import {RxStompService} from '@stomp/ng2-stompjs';
import {UserService} from './user.service';
import {NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {AuthService} from './auth.service';
import {Observable, of} from 'rxjs';
import {PomodoroService} from './pomodoro.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketProxyService {

  constructor(private webSocketService: RxStompService, private authService: AuthService) {
  }


  publish(destination: string, body?: any) {
    return this.webSocketService.publish({
      destination: destination, body: body
      , headers: {Authorization: this.authService.currentAccessTokenValue}
    });
  }

  watch(destination: string): Observable<any> {
    return this.webSocketService.watch(destination, {Authorization: this.authService.currentAccessTokenValue});
  }
}
