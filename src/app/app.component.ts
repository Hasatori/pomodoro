import {Component, HostListener} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Pomodoro} from './model/pomodoro';
import {PomodoroService} from './services/pomodoro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private loginService: AuthService,private pomodoroService:PomodoroService) {
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.pomodoroService.timer.isRunning()) {
     this.pomodoroService.resetPomodoroForCurrentUser();
    }
  }
  logOut(): void {
    this.loginService.logout();
  }

}
