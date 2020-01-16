import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../model/user';
import {Timer} from '../../../../model/Timer';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
@Input() user:User;
@Input()timer:Timer;



  constructor() { }

  ngOnInit() {
  }

}
