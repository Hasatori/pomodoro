import {AfterViewInit, Component, HostListener, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {User} from '../../../../model/user';
import {RxStompService} from '@stomp/ng2-stompjs';
import {AuthService} from '../../../../services/auth.service';
import {UserService} from '../../../../services/user.service';
import {WebSocketProxyService} from '../../../../services/web-socket-proxy.service';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../../../../services/group.service';
import {GroupMessage} from '../../../../model/group-message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {

  @Input('users') users: Array<User>;
  @Input('group') groupName: string;
  messages: Array<GroupMessage> = new Array<GroupMessage>();
  user: User;
  scrollableWindow;
  fetchingOlder: boolean = false;
  olderFetched: boolean = false;
  stopFetchingOlder: boolean = false;
  private threshold = 0;
  private limit = 10;
  private end = this.threshold + this.limit;
  @ViewChildren('messages') messagesContainer: QueryList<any>;
  private audio: HTMLAudioElement;
  private SOUNDS_PATH: string = '../../../../assets/sounds/';
  private messageCameSoundName: string = 'deduction.mp3';

  constructor(private webSocketProxyService: WebSocketProxyService, private userService: UserService, private groupService: GroupService) {
    this.audio = document.createElement('audio');
    this.audio.setAttribute('src', this.SOUNDS_PATH + this.messageCameSoundName);

  }

  ngOnInit() {

    this.userService.getUser().subscribe((user) => {
      this.user = user;

    });
    this.groupService.getUsersForGroup(this.groupName).subscribe((users) => {
    });
    this.webSocketProxyService.watch('/group/' + this.groupName + '/chat').subscribe(response => {
      let message: GroupMessage = JSON.parse(response.body);
      console.log(message);
      this.messages.push(message);
      if (message.author.username !== this.user.username) {
        this.audio.play();
      }

    });
    this.groupService.getLastNumberOfGroupMessages(this.groupName, this.threshold, this.end).subscribe((response) => {
      this.messages = response.sort(function(a, b) {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      this.threshold += this.limit;
      this.end += this.limit;
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

  ngAfterViewInit(): void {
    this.scrollableWindow = document.getElementById('scrollable-window');
    this.messagesContainer.changes.subscribe(t => {
      if (!this.fetchingOlder && !this.olderFetched) {
        this.scrollableWindow.scrollTop = this.scrollableWindow.scrollHeight + 500;
      }
      if (this.olderFetched) {
        this.olderFetched = false;
        this.scrollableWindow.scrollTop = this.scrollableWindow.scrollHeight - this.scrollableWindow.scrollHeight * 0.95;
      }
    });

  }

  scrolled() {
    if (this.scrollableWindow.scrollTop == 0 && !this.stopFetchingOlder) {
      this.fetchingOlder = true;
      setTimeout(() => {
        this.groupService.getLastNumberOfGroupMessages(this.groupName, this.threshold, this.end).subscribe((response) => {
          if (response.length > 0) {
            this.messages = this.messages.concat(response);
            this.messages.sort(function(a, b) {
              return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            });
            this.threshold += this.limit;
            this.end += this.limit;

            this.fetchingOlder = false;
            this.olderFetched = true;
          } else {
            this.fetchingOlder = false;
            this.stopFetchingOlder = true;
          }
        });
      }, 500);

    }
  }
}
