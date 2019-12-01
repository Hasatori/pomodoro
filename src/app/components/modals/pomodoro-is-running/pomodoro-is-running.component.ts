import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {PomodoroService} from '../../../services/pomodoro.service';
import {ModalDirective} from 'angular-bootstrap-md';
@Component({
  selector: 'app-pomodoro-is-running',
  templateUrl: './pomodoro-is-running.component.html',
  styleUrls: ['./pomodoro-is-running.component.scss']
})
export class PomodoroIsRunningComponent implements AfterViewInit {
  private RESET_WARNING_MODAL_SHOWN_KEY:string='resetWarningModalShown';
  // @ts-ignore
  @ViewChild('frame') input:ModalDirective;
  constructor() {

  }
  ngAfterViewInit(): void {
    if (!this.getResetWarningPopupShown()){
      this.input.show();
      this.setResetWarningPopupShown();
    }

   }
  private setResetWarningPopupShown(){
    window.sessionStorage.setItem(this.RESET_WARNING_MODAL_SHOWN_KEY,JSON.stringify(true));
  }
  private getResetWarningPopupShown():boolean{
    return JSON.parse(window.sessionStorage.getItem(this.RESET_WARNING_MODAL_SHOWN_KEY));
  }

}
