import {AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {User} from '../../../../model/user';
import {GroupMessage} from '../../../../model/group-message';
import {Subscription} from 'rxjs';
import {UserServiceProvider} from '../../../../services/user-service-provider';
import {Reaction} from '../../../../model/reaction';
import {isUndefined} from 'util';

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
  messagesContainerLength: number = 0;
  seenBy: string = '';
  lastMessage: GroupMessage;
  private oldMessageTimeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  private recentMessageTimeOptions = {hour: 'numeric'};

  private typing: boolean = false;
  private showReactions: boolean = false;

  chatHidden: boolean = false;
  reactionsNames: Array<string> =
    [
      'happy',
      'sad',
      'angry',
      'crying',
      'thumbs-up',
      'thumbs-down'
    ];


  private markAllAsReadSubscription: Subscription;
  private newGroupMessageSubscription: Subscription;
  private lastNumberOfGroupMessagesSubscription: Subscription;
  private groupMessageReactionSubscription: Subscription;

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
      this.setReactionsForMessage(newMessage);
      this.messages.push(newMessage);
      this.processMessagesFromBack(this.messages);
      if (!this.chatHidden){
        this.markAllAsReadAndProcessResponse();
      }
    });
    this.groupMessageReactionSubscription = this.userServiceProvider.groupService.getReactedGroupMessage(this.groupName).subscribe((reactedMessage) => {
      console.log(reactedMessage);
      let foundMessage = this.messages.find(message => {
        return message.id === reactedMessage.id;
      });
      if (!isUndefined(foundMessage)) {
        this.setReactionsForMessage(reactedMessage);
        foundMessage.reactions = reactedMessage.reactions;
        let reaction = foundMessage.reactions.find(r => {
          return r.users.some(user => {
            return user.username === this.user.username;
          });
        });
        foundMessage.currentUserReaction = isUndefined(reaction) ? null : reaction.name;
      }
    });
    this.lastNumberOfGroupMessagesSubscription = this.userServiceProvider.groupService.getLastNumberOfGroupMessages(this.groupName, this.threshold, this.end).subscribe((response) => {
      this.messages = response.sort(function(a, b) {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      for (let i = 0; i < this.messages.length; i++) {
        let message = this.messages[i];
        this.setReactionsForMessage(message);
        message.shouldShowAuthorsName = this.shouldShowAuthorsName(message, i - 1 !== 0 ? this.messages[i - 1] : null);
        message.shouldShowAuthorsPhoto = this.shouldShowAuthorsPhotograph(message, i < this.messages.length - 1 ? this.messages[i + 1] : null);
      }
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
    this.typing = false;
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
          .join(', ')} on ${new Date(lastRelatedMessageTimestamp.readTimestamp).toLocaleDateString('en-US', this.oldMessageTimeOptions)}`;
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

      result = new Date(currentDate.getMilliseconds() - diff.seconds() * 1000).toLocaleTimeString('en-US');
    }
    if (diff.hours() >= 24) {
      result = new Date(messageTimestamp).toLocaleDateString('en-US', this.oldMessageTimeOptions);
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
      let currentLength = t._results.length;
      if (currentLength !== this.messagesContainerLength) {
        this.messagesContainerLength = currentLength;

        if (!this.fetchingOlder && !this.olderFetched) {
          this.scrollableWindow.scrollTop = this.scrollableWindow.scrollHeight + 500;

        }
        if (this.olderFetched) {
          this.olderFetched = false;
          this.scrollableWindow.scrollTop = this.scrollableWindow.scrollHeight - this.scrollableWindow.scrollHeight * 0.95;
        }
      }


    });
  }

  scrolled() {
    console.log(this.scrollableWindow.scrollTop);
    if (this.scrollableWindow.scrollTop == 0 && !this.stopFetchingOlder) {
      this.fetchingOlder = true;
      setTimeout(() => {
        this.userServiceProvider.groupService.getLastNumberOfGroupMessages(this.groupName, this.threshold, this.end).subscribe((response) => {
          if (response.length > 0) {
            this.messages = this.messages.concat(response);

            this.messages.sort(function(a, b) {
              return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            });
            for (let i = 0; i < this.messages.length; i++) {
              let message = this.messages[i];
              this.setReactionsForMessage(message);
              message.shouldShowAuthorsName = this.shouldShowAuthorsName(message, i < this.messages.length - 1 ? this.messages[i + 1] : null);
              message.shouldShowAuthorsPhoto = this.shouldShowAuthorsPhotograph(message, i !== 0 ? this.messages[i - 1] : null);
            }

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

  processMessagesFromBack(messages: Array<GroupMessage>) {
    for (let i = messages.length - 1; i >= 0; i--) {
      let currentMessage = messages[i];
      currentMessage.shouldShowAuthorsPhoto = false;
      if (i - 1 >= 0) {
        let previous = messages[i - 1];
        if (currentMessage.author.username === previous.author.username) {
          currentMessage.shouldShowAuthorsName = false;

        } else {
          currentMessage.shouldShowAuthorsName = true;
          break;
        }
      }
    }
    messages[messages.length - 1].shouldShowAuthorsPhoto = true;
  }

  shouldShowAuthorsPhotograph(currentMessage: GroupMessage, nextMessage: GroupMessage): boolean {
    return nextMessage == null || nextMessage.author.username !== currentMessage.author.username;

  }

  shouldShowAuthorsName(currentMessage: GroupMessage, previousMessage: GroupMessage) {
    return previousMessage == null || previousMessage.author.username !== currentMessage.author.username;

  }

  reaction(message: string) {
    console.log(message);
  }

  setReactionsForMessage(message: GroupMessage) {
    let reactions: Array<Reaction> = [];
    this.reactionsNames.forEach(reactionName => {
      reactions.push(this.createReaction(reactionName));
    });
    message.relatedGroupMessages.forEach(relatedMessage => {
      let reaction = reactions.find(reaction => {
        return reaction.name === relatedMessage.reaction;
      });
      if (!isUndefined(reaction) && reaction !== null) {
        reaction.users.push(relatedMessage.user);
      }
      if (relatedMessage.user.username === this.user.username) {
        message.currentUserReaction = relatedMessage.reaction;
      }
    });
    message.reactions = reactions;
  }

  createReaction(reactionName: string): Reaction {
    let newReaction = new Reaction();
    newReaction.name = reactionName;
    newReaction.users = [];
    return newReaction;
  }

  addReactionsClicked() {
    if (this.showReactions) {
      this.showReactions = false;
    } else {
      this.showReactions = true;
    }
  }

  react(message: GroupMessage, reactionName: string) {
    this.userServiceProvider.groupService.reactToGroupMessage(this.groupName, message, reactionName);
  }

  removeReaction(message: GroupMessage) {
    this.userServiceProvider.groupService.reactToGroupMessage(this.groupName, message, null);
  }

  hideOrShowChat() {
    let chat = document.getElementById('chat');
    if (this.chatHidden) {
      chat.className = chat.className.replace('hidden', '');
      this.chatHidden = false;
    } else {
      chat.className = chat.className + ' hidden';
      this.chatHidden = true;
    }

  }
}
