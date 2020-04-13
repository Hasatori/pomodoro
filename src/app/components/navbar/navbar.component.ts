import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FreeTrialService} from '../../services/free-trial.service';
import {User} from '../../model/user/user';
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
