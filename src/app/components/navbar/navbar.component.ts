import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {PomodoroService} from '../../services/pomodoro.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() myEvent = new EventEmitter<string>();

  constructor(private loginService: AuthService,private pomodoroService:PomodoroService,private router:Router) {
  }

  ngOnInit() {
  }
  callParent() {
    this.myEvent.emit('eventDesc');
  }
}
