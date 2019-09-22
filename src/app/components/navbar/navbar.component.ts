import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() myEvent = new EventEmitter<string>();

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
  }

  callParent() {
    this.myEvent.emit('eventDesc');
  }
}
