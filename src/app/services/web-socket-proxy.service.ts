import {Injectable} from '@angular/core';
import {first} from 'rxjs/operators';
import {webSocketConfig} from '../WebSocketConfig';
import {RxStompService} from '@stomp/ng2-stompjs';
import {UserService} from './user.service';
import {NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketProxyService {

  constructor(private webSocketService: RxStompService, private userService: UserService, private log: NGXLogger, private authService: AuthService) {
  }

  public initSocket() {
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
      }
    );
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
