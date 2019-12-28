import {AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {User} from '../../../../model/user';
import {GroupMessage} from '../../../../model/group-message';
import {Subscription} from 'rxjs';
import {UserServiceProvider} from '../../../../services/user-service-provider';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {

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
  seenBy: string = '';
  lastMessage: GroupMessage;
  private options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

  private markAllAsReadSubscription: Subscription;
  private newGroupMessageSubscription: Subscription;
  private lastNumberOfGroupMessagesSubscription: Subscription;


  constructor(private userServiceProvider: UserServiceProvider) {

  }

  ngOnInit() {
    this.markAllAsReadAndProcessResponse();
    this.userServiceProvider.userService.getUser().subscribe((user) => {
      this.user = user;

    });
    this.userServiceProvider.groupService.getUsersForGroup(this.groupName).subscribe((users) => {
    });
    this.newGroupMessageSubscription = this.userServiceProvider.groupService.getNewGroupMessage(this.groupName).subscribe((newMessage) => {
      this.seenBy = '';
      this.messages.push(newMessage);
      this.markAllAsReadAndProcessResponse();
    });
    this.lastNumberOfGroupMessagesSubscription = this.userServiceProvider.groupService.getLastNumberOfGroupMessages(this.groupName, this.threshold, this.end).subscribe((response) => {
      this.messages = response.sort(function(a, b) {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      this.threshold += this.limit;
      this.end += this.limit;
    });

  }

  ngOnDestroy(): void {
    this.markAllAsReadSubscription.unsubscribe();
    this.newGroupMessageSubscription.unsubscribe();
    this.lastNumberOfGroupMessagesSubscription.unsubscribe();

  }

  sendMessage(messageValue: string) {
    this.userServiceProvider.webSocketProxyService.publish('/app/group/' + this.groupName + '/chat', messageValue);

  }

  markAllAsReadAndProcessResponse() {
    this.markAllAsReadSubscription = this.userServiceProvider.groupService.markAllFromGroupAsRead(this.groupName).subscribe((lastMessage) => {
      this.lastMessage = lastMessage;
      let filteredRelatedMessages = lastMessage.relatedGroupMessages
        .filter(message => message.readTimestamp !== null && message.user.username !== this.user.username && message.user.username !== lastMessage.author.username);
      let lastRelatedMessageTimestamp = filteredRelatedMessages.sort(function(a, b) {
        return new Date(a.readTimestamp).getTime() - new Date(b.readTimestamp).getTime();
      })[0];
      if (filteredRelatedMessages.length > 0) {
        this.seenBy = `${filteredRelatedMessages.map(message => message.user.username)
          .join(', ')} on ${new Date(lastRelatedMessageTimestamp.readTimestamp).toLocaleDateString('en-US', this.options)}`;
      }
    });
  }

  getMessageTimestampRelevance(messageTimestamp: Date): string {
    let currentDate = new Date();
    let DateDiff = require('date-diff');
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
        this.userServiceProvider.groupService.getLastNumberOfGroupMessages(this.groupName, this.threshold, this.end).subscribe((response) => {
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
