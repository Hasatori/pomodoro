import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {AuthService} from './services/auth.service';
import {PomodoroService} from './services/pomodoro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private loginService: AuthService, private pomodoroService: PomodoroService) {

  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.pomodoroService.timer.isRunning()){
      $event.returnValue =true;
    }
  }

  logOut(): void {
    this.loginService.logout();
  }

  ngOnDestroy() {

  }
}
