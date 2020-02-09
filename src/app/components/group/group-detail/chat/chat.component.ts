import {AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {User} from '../../../../model/user';
import {GroupMessage} from '../../../../model/group-message';
import {Observable, of, Subscription} from 'rxjs';
import {UserServiceProvider} from '../../../../services/user-service-provider';
import {Reaction} from '../../../../model/reaction';
import {isUndefined} from 'util';
import {Group} from '../../../../model/group';
import {HttpClient, HttpEventType, HttpHeaders, HttpResponse} from '@angular/common/http';
import {listAnimation, onCreateListAnimation} from "../../../../animations";
import {getEnvironment} from "../../../../ServerConfig";
import {saveAs} from 'file-saver';
import {SecureImagePipe} from "../../../../pipes/secure-image.pipe";
import {SafeUrl} from "@angular/platform-browser";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() group: Group;
  messages: Array<GroupMessage> = [];
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

  public typing: boolean = false;
  public showReactions: boolean = false;

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

  private emojis: Array<any> =
    [
      {name: 'happy', textExpression: ':)'},
      {name: 'sad', textExpression: ':('},
    ];

  private markAllAsReadSubscription: Subscription;
  private newGroupMessageSubscription: Subscription;
  private lastNumberOfGroupMessagesSubscription: Subscription;
  private groupMessageReactionSubscription: Subscription;
  public loading: boolean = false;
  chatMutted: boolean = false;
  private progress: number = 0;
  private scrollTimer = null;
  private resendGroupMessageSubscription: Subscription;

  private imageExtensions: Array<string> = ['jpg', 'png', 'gif', 'svg', 'tif'];

  private attachmentsPath: string = './../../../../assets/group/chat/attachment/';
  private fileExtensions = [
    {
      extension: 'doc',
      path: `${this.attachmentsPath}word.svg`
    },
    {
      extension: 'docx',
      path: `${this.attachmentsPath}docx.svg`
    },
    {
      extension: 'xlsx',
      path: `${this.attachmentsPath}excel.svg`
    },
    {
      extension: 'txt',
      path: `${this.attachmentsPath}txt.svg`
    },
    {
      extension: 'pptx',
      path: `${this.attachmentsPath}powerpoint.svg`
    },
    {
      extension: 'zip',
      path: `${this.attachmentsPath}zip.svg`
    },
    {
      extension: 'pdf',
      path: `${this.attachmentsPath}pdf.svg`
    },
    {
      extension: 'default',
      path: `${this.attachmentsPath}default.svg`
    },
  ];

  constructor(private http: HttpClient, public userServiceProvider: UserServiceProvider, public secureImage: SecureImagePipe) {


  }

  ngOnInit() {
    this.loading = true;
    this.markAllAsReadAndProcessResponse();
    this.userServiceProvider.userService.getUser().subscribe((user) => {
      this.user = user;

    });
    this.newGroupMessageSubscription = this.userServiceProvider.groupService.getNewGroupMessage(this.group.name).subscribe((newMessage) => {
      this.seenBy = '';
      this.setReactionsForMessage(newMessage);
      this.messages.push(newMessage);
      this.processMessagesFromBack(this.messages);
    });
    this.resendGroupMessageSubscription = this.userServiceProvider.groupService.getResendGroupMessage(this.group.name).subscribe((newMessage) => {
      this.seenBy = '';
      this.messages.push(newMessage);
      this.processMessagesFromBack(this.messages);
    });
    this.groupMessageReactionSubscription = this.userServiceProvider.groupService.getReactedGroupMessage(this.group.name).subscribe((reactedMessage) => {
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
    this.lastNumberOfGroupMessagesSubscription = this.userServiceProvider.groupService.getLastNumberOfGroupMessages(this.group.name, this.threshold, this.end).subscribe((response) => {
      this.messages = response.sort(function (a, b) {
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
      this.loading = false;
    });

  }

  ngOnDestroy(): void {
    this.markAllAsReadSubscription.unsubscribe();
    this.newGroupMessageSubscription.unsubscribe();
    this.lastNumberOfGroupMessagesSubscription.unsubscribe();
    this.resendGroupMessageSubscription.unsubscribe();
  }

  sendMessage(messageValue: string) {
    this.userServiceProvider.webSocketProxyService.publish('/app/group/' + this.group.name + '/chat', messageValue);
    this.typing = false;
  }

  resendMessage(groupMessage: GroupMessage) {
    this.userServiceProvider.webSocketProxyService.publish('/app/group/' + this.group.name + '/chat/resend', groupMessage);
    this.typing = false;
  }

  markAllAsReadAndProcessResponse() {
    this.markAllAsReadSubscription = this.userServiceProvider.groupService.markAllFromGroupAsRead(this.group.name).subscribe((lastMessage) => {
      this.lastMessage = lastMessage;
      let filteredRelatedMessages = lastMessage.relatedGroupMessages
        .filter(message => message.readTimestamp !== null && message.user.username !== this.user.username && message.user.username !== lastMessage.author.username);
      let lastRelatedMessageTimestamp = filteredRelatedMessages.sort(function (a, b) {
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
    // @ts-ignore
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
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    this.scrollTimer = setTimeout(() => this.handleScroll(), 500);
  }

  handleScroll() {
    console.log("Scrolled");
    if (this.scrollableWindow.scrollTop == 0 && !this.stopFetchingOlder) {
      this.fetchingOlder = true;
      setTimeout(() => {
        this.userServiceProvider.groupService.getLastNumberOfGroupMessages(this.group.name, this.threshold, this.end).subscribe((response) => {
          if (response.length > 0) {
            this.messages = this.messages.concat(response);

            this.messages.sort(function (a, b) {
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
    //  this.addReactionToMessage(message,reactionName);
    this.userServiceProvider.groupService.reactToGroupMessage(this.group.name, message, reactionName);

  }

  removeReaction(message: GroupMessage, reactionName: string) {
    /*
        let currentUserReaction = message.reactions.find(r => {
          return r.name === reaction && r.users.some(user => user.username == this.user.username);
        });
        currentUserReaction.users = currentUserReaction.users.UserFilter(user => {
          return user.username !== this.user.username;
        });
    */

    this.userServiceProvider.groupService.reactToGroupMessage(this.group.name, message, null);

  }

  addReactionToMessage(message: GroupMessage, reaction: string) {
    let foundReaction = message.reactions.find(r => {
      return r.name === reaction;
    });
    let currentUserReaction = message.reactions.find(r => {
      return r.name === reaction && r.users.some(user => user.username == this.user.username);
    });
    currentUserReaction.users = currentUserReaction.users.filter(user => {
      return user.username !== this.user.username;
    });
    if (isUndefined(foundReaction)) {
      foundReaction = this.createReaction(reaction);
    }
    foundReaction.users.push(this.user);
    message.currentUserReaction = reaction;
    message.reactions.push(foundReaction);
  }

  getInnerHtml(message: string): string {
    for (let emoji of this.emojis) {
      let emojiTextExpression = emoji.textExpression.replace(/(\)|\()/, '\\$1');
      message = message.replace(new RegExp(emojiTextExpression, 'g'), `<img width="18" src="../../../../../assets/emojis/051-${emoji.name}.svg">`);

    }
    return message;

  }

  downloadAttachment(groupMessage: GroupMessage) {
    let endpoint = `${getEnvironment().backend}group/${this.group.id}/attachment/${groupMessage.attachment}/download`;
    this.http.post(endpoint, {}, {
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    }).subscribe((response) => {
      const file = new File([response], groupMessage.attachment);
      saveAs(response, groupMessage.value);
    });
  }

  isAttachmentImage(attachment: string): boolean {
    let extension = attachment.substr(attachment.lastIndexOf('.') + 1);
    return this.imageExtensions.some(ext => {
      return ext === extension
    });
  }

  getAttachmentIcon(attachment: string): string {
    let extension = attachment.substr(attachment.lastIndexOf('.') + 1);
    let result = this.fileExtensions.find(fileExtension => {
      return fileExtension.extension === 'default'
    });
    let candidate = this.fileExtensions.find((fileExtension => {
      return fileExtension.extension === extension
    }));
    if (!isUndefined(candidate)) {
      result = candidate;
    }
    return result.path;
  }

}
