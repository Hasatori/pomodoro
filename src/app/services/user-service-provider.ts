import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {GroupService} from './group.service';
import {PomodoroService} from './pomodoro.service';
import {UserService} from './user.service';
import {WebSocketManagerService} from './web-socket-manager.service';
import {WebSocketProxyService} from './web-socket-proxy.service';
import {TodoService} from './todo.service';
import {CachingService} from './caching.service';
import {ServerConfigService} from './server-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceProvider {

  constructor(
    public authService: AuthService,
    public groupService: GroupService,
    public pomodoroService: PomodoroService,
    public userService: UserService,
    public webSocketManagerService: WebSocketManagerService,
    public webSocketProxyService: WebSocketProxyService,
    public todoService:TodoService,
    public cachingService:CachingService,
    public serverConfig:ServerConfigService
  ) {
  }
}
