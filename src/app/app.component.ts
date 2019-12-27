import {Component, HostListener} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Pomodoro} from './model/pomodoro';
import {PomodoroService} from './services/pomodoro.service';
import {WebSocketProxyService} from './services/web-socket-proxy.service';
import {GroupService} from './services/group.service';
import {WebSocketManagerService} from './services/web-socket-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private webSocketManager: WebSocketManagerService, private webSocketInitService: WebSocketProxyService, private loginService: AuthService, private pomodoroService: PomodoroService) {
    if (loginService.isLoggedIn()) {
      webSocketManager.initAllSockets();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.pomodoroService.startedLocally) {
      this.pomodoroService.resetPomodoroForCurrentUser();
    }

  }

  logOut(): void {
    this.pomodoroService.resetPomodoroForCurrentUser();
    this.loginService.logout();
  }

}
