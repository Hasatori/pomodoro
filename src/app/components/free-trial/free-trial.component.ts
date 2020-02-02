import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CountdownComponent, CountdownEvent, CountdownTimer} from 'ngx-countdown';
import {Pomodoro} from '../../model/pomodoro';
import {RxStompService, StompRService, StompService} from '@stomp/ng2-stompjs';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';
import {webSocketConfig} from '../../WebSocketConfig';
import {User} from '../../model/user';
import {PomodoroService} from '../../services/pomodoro.service';
import {Timer} from '../../model/Timer';
import {NGXLogger} from 'ngx-logger';
import {thresholdScott} from 'd3-array';
import {FreeTrialService} from '../../services/free-trial.service';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './free-trial.component.html',
  styleUrls: ['./free-trial.component.scss']
})
export class FreeTrialComponent {

  constructor(public freeTrialService:FreeTrialService) {
  }

}
