import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {PomodoroService} from '../../../services/pomodoro.service';
import {ModalDirective} from 'angular-bootstrap-md';
import {Modal} from '../modal';

@Component({
  selector: 'app-pomodoro-is-running',
  templateUrl: './pomodoro-is-running.component.html',
  styleUrls: ['./pomodoro-is-running.component.scss']
})
export class PomodoroIsRunningComponent extends Modal implements AfterViewInit {
  // @ts-ignore
  @ViewChild('pomodoroIsRunning') input: ModalDirective;
  private WAIT: number = 600000;// 10 Minutes
  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.input.show();
    this.input.onHide.subscribe(() => {
      this.waitAndShowAgain(this.WAIT, this.input);
    });
  }


}
