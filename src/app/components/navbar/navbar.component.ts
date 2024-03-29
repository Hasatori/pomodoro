import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {PomodoroService} from '../../services/pomodoro.service';
import {Router} from '@angular/router';
import {FreeTrialService} from '../../services/free-trial.service';
import {first} from 'rxjs/operators';
import {GroupService} from '../../services/group.service';
import {Group} from '../../model/group';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user';
import {UserServiceProvider} from '../../services/user-service-provider';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() myEvent = new EventEmitter<string>();
  private user: User;

  constructor(public  userServiceProvider: UserServiceProvider, public router: Router, public freeTrialService: FreeTrialService) {
    userServiceProvider.userService.getUser().subscribe(user => {
      this.user = user;
    });

  }

  ngOnInit() {

  }

  callParent() {
    this.myEvent.emit('eventDesc');
  }
}
