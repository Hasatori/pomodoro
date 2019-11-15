import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {AuthService} from './services/auth.service';
import {PomodoroService} from './services/pomodoro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private loginService: AuthService) {

  }


  logOut(): void {
    this.loginService.logout();
  }

  ngOnDestroy() {

  }
}
