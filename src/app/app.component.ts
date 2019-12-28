import {Component, HostListener} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Pomodoro} from './model/pomodoro';
import {PomodoroService} from './services/pomodoro.service';
import {WebSocketProxyService} from './services/web-socket-proxy.service';
import {GroupService} from './services/group.service';
import {WebSocketManagerService} from './services/web-socket-manager.service';
import {ToastService} from 'ng-uikit-pro-standard';
import {ConnectionService} from 'ng-connection-service';
import {UserServiceProvider} from './services/user-service-provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private connectionService: ConnectionService, private toastrService: ToastService,private userServiceProvider:UserServiceProvider) {
    if (userServiceProvider.authService.isLoggedIn()) {
      userServiceProvider.webSocketManagerService.initAllSockets();
    }
    const options = {opacity: 0.8};
    this.connectionService.monitor().subscribe(isConnected => {
      if (isConnected) {
        this.toastrService.success('', 'Internet connection is up again', options);
      } else {
        this.toastrService.error('Caching was enabled. You can use some functions even while offline. All data will be synced once you are online again', 'Internet connection is down', options);

      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.userServiceProvider.pomodoroService.startedLocally) {
      this.userServiceProvider.pomodoroService.resetPomodoroForCurrentUser();
    }

  }

  logOut(): void {
    this.userServiceProvider.pomodoroService.resetPomodoroForCurrentUser();
    this.userServiceProvider.authService.logout();
  }

}
