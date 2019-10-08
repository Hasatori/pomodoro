import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss']
})
export class PomodoroComponent implements OnInit {

  private phase: string='WORK';

  constructor() {
  }

  ngOnInit() {
  }

}
