import {Component, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../../model/user/user';
import {Timer} from '../../../../../model/user/timer';
import {UserServiceProvider} from '../../../../../services/user-service-provider';
import {EventEmitter} from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() user: User;
  @Input() timer: Timer;
  @Input() isOwner: boolean;
  @Input() numberOfUnreadMessagesFromUser: number;

  @Output() openChat: EventEmitter<any> = new EventEmitter();

  constructor(public userServiceProvider: UserServiceProvider) {
  }

  ngOnInit() {

  }

}
