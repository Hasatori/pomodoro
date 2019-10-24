import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CountdownComponent, CountdownEvent, CountdownTimer} from 'ngx-countdown';
import {Pomodoro} from '../../redux/pomodoro/pomodoro';
import {RxStompService, StompRService, StompService} from '@stomp/ng2-stompjs';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';
import {webSocketConfig} from '../../WebSocketConfig';
import {User} from '../../redux/user/user';
import {PomodoroService} from '../../services/pomodoro.service';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss']
})
export class PomodoroComponent {


  constructor( private pomodoroService: PomodoroService) {

  }


}
