import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../../model/user/user';
import {Timer} from '../../../../../model/user/timer';
import {UserServiceProvider} from '../../../../../services/user-service-provider';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
@Input() user:User;
@Input()timer:Timer;
@Input()isOwner:boolean;

  constructor(public userServiceProvider:UserServiceProvider) { }

  ngOnInit() {
  }

}
