import {Component, HostListener, OnInit} from '@angular/core';
import {PomodoroService} from '../../../services/pomodoro.service';

@Component({
  selector: 'app-pomodoro-is-running',
  templateUrl: './pomodoro-is-running.component.html',
  styleUrls: ['./pomodoro-is-running.component.scss']
})
export class PomodoroIsRunningComponent implements OnInit {
  constructor( private pomodoroService: PomodoroService) {

  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    // if (this.pomodoroService.timer.isRunning()){
    //   $event.preventDefault();
    // }

  }

  ngOnInit() {
  }

}
