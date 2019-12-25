import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../model/user';
import {RxStompService} from '@stomp/ng2-stompjs';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {Group} from '../../../../model/group';
import {WebSocketProxyService} from '../../../../services/web-socket-proxy.service';
import {ChatMessage} from '../../../../model/chat-message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input('users') users: Array<User>;
  @Input('group') groupName: string;
  messages: Array<ChatMessage> = new Array<ChatMessage>();
  user: User;

  constructor(private webSocketProxyService: WebSocketProxyService, private userService: UserService) {

  }

  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.user = user;

    });
    this.webSocketProxyService.watch('/group/' + this.groupName + '/chat').subscribe(response => {
      let message = JSON.parse(response.body);
      console.log(message);
      this.messages.push(message);
    });
  }

  sendMessage(messageValue: string) {
    this.webSocketProxyService.publish('/app/group/' + this.groupName + '/chat', messageValue);
  }

  getMessageTimestampRelevance(messageTimestamp: Date): string {
    let currentDate = new Date();
    let DateDiff = require('date-diff');
    console.log(messageTimestamp);
    let diff = new DateDiff(currentDate, new Date(messageTimestamp));
    let result = this.getResult(diff.seconds(), 'second');
    if (diff.seconds() < 5) {
      result = 'now';
    }
    if (diff.seconds() >= 60) {
      result = this.getResult(diff.minutes(), 'minute');
    }
    if (diff.minutes() >= 60) {
      result = this.getResult(diff.hours(), 'hour');
    }
    if (diff.hours() >= 24) {
      result = this.getResult(diff.days(), 'day');
    }
    if (diff.days() >= 30) {
      result = this.getResult(diff.months(), 'month');
    }
    if (diff.months() >= 12) {
      result = this.getResult(diff.years(), 'year');
    }
    return result;
  }

  private getResult(value: number, unit: string): string {
    if (value >= 2) {
      unit = `${unit}s`;
    }
    return `${Math.floor(value)} ${unit} ago`;
  }
}
