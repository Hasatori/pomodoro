import { Injectable } from '@angular/core';
import {GroupService} from './group.service';
import {PomodoroService} from './pomodoro.service';
import {WebSocketProxyService} from './web-socket-proxy.service';
import {UserService} from './user.service';
import {first} from 'rxjs/operators';
import {webSocketConfig} from '../WebSocketConfig';
import {RxStompService} from '@stomp/ng2-stompjs';
import {NGXLogger} from 'ngx-logger';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketManagerService {

  constructor(private authService:AuthService,private log: NGXLogger,private webSocketService: RxStompService, private userService: UserService,private groupService: GroupService, private pomodoroService: PomodoroService) { }

initAllSockets(){
  this.userService.getUser().pipe(first()).subscribe(
    user => {
      this.log.debug(`Initializing socket for user { ${JSON.stringify(user)} }`);
      // create an empty headers object
      const headers = {};
      // make that CSRF token look like a real header
      headers['Authorization'] = this.authService.currentAccessTokenValue;
      // put the CSRF header into the connectHeaders on the config
      const config = {...webSocketConfig, headers: headers, connectHeaders: headers};
      this.webSocketService.configure(config);
      this.webSocketService.activate();
      this.pomodoroService.init();
      this.groupService.startSockets();
    }
  )
}
}
