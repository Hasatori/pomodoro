import {Component} from '@angular/core';
import {UserServiceProvider} from '../../services/user-service-provider';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss']
})
export class PomodoroComponent {
  todosVisible: boolean = true;

  constructor(private userServiceProvider: UserServiceProvider) {
  }


}
