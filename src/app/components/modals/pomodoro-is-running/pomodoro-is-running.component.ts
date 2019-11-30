import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {PomodoroService} from '../../../services/pomodoro.service';
import {ModalDirective} from 'angular-bootstrap-md';
@Component({
  selector: 'app-pomodoro-is-running',
  templateUrl: './pomodoro-is-running.component.html',
  styleUrls: ['./pomodoro-is-running.component.scss']
})
export class PomodoroIsRunningComponent implements AfterViewInit {

  // @ts-ignore
  @ViewChild('frame') input:ModalDirective;
  constructor( private pomodoroService: PomodoroService) {

  }



  ngAfterViewInit(): void {
   this.input.show();
   }

}
