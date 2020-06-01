import {
  Component,
  DoCheck,
  Input, IterableChanges,
  IterableDiffer,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {listAnimation, onCreateListAnimation} from "../../../../animations";
import {User} from "../../../../model/user/user";
import {Group} from "../../../../model/group/group";
import {MessageAttachment} from "../../../../model/attachment/message-attachment";
import {GroupMessage} from "../../../../model/message/group-message";
import {UserReaction} from "../../../../model/reaction/user-reaction";
import {Message} from "../../../../model/message/message";
import {Observable, Subscription} from "rxjs/index";
import {SecureImagePipe} from "../../../../pipes/secure-image.pipe";
import {UserServiceProvider} from "../../../../services/user-service-provider";
import {CachedImagePipe} from "../../../../pipes/cached-image.pipe";
import {HttpClient} from "@angular/common/http";
import {DirectMessage} from "../../../../model/message/direct-message";
import {Chat} from "../../../../model/message/chat";
import {isUndefined} from "util";
import {IsUserTyping} from "../../../../model/message/is-user-typing";

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss'],
  animations: [listAnimation, onCreateListAnimation]
})
export class CommunicationComponent implements OnInit, OnDestroy, DoCheck {

  @Input() group: Group;
  @Input() chatUsers: Array<User>;
  @Input() currentUser: User;
  subscriptions: Array<Subscription> = [];


  chats: Array<Chat> = [];
  private threshold = 0;
  private limit = 10;
  private end = this.threshold + this.limit;

  chatsShown: boolean = true;
  count: number = 0;
  emojis = [
    Emoji.HAPPY,
    Emoji.SAD,
    Emoji.ANGRY,
    Emoji.CRYING,
    Emoji.THUMBS_UP,
    Emoji.THUMBS_DOWN
  ];
  now: Date = new Date();
  private differ: IterableDiffer<User>;

  constructor(private http: HttpClient, public userServiceProvider: UserServiceProvider, public secureImage: SecureImagePipe, public cachedImage: CachedImagePipe, differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {


    let chat: Chat = {
      name: this.group.name,
      limit: this.limit,
      end: this.end,
      threshold: this.threshold,
      closeable: false,
      messages: [],
      typingUsers: [] = [],
      loadOlder: () => {
        this.fetchOlderGroupMessages(chat);
      },
      sendMessage: (value) => {
        this.userServiceProvider.groupService.sendMessage(value, this.group);
      },
      editMessage: (message => {
        let groupMessage = message as GroupMessage;
        this.userServiceProvider.groupService.editMessage(groupMessage, this.group);
      }),
      answerMessage: (answerMessage => {
        this.userServiceProvider.groupService.answerMessage(answerMessage, this.group);
      }),
      reportIfCurrentUserIsTyping: (isTyping => {
        this.userServiceProvider.groupService.reportTypingToUser(isTyping, this.group)
      })
    } as Chat;

    this.chats.push(chat);
    this.fetchOlderGroupMessages(chat);
    this.subscriptions.push(this.userServiceProvider.groupService.getGroupMessageFromGroup(this.group).subscribe(groupMessage => {
      chat.messages = chat.messages.concat(this.modifyNewMessages([groupMessage]));
    }));
    this.subscriptions.push(this.userServiceProvider.groupService.getResendGroupMessageFromGroup(this.group).subscribe(directMessage => {
      console.log(directMessage);
      chat.messages = chat.messages.filter(message => message.id !== directMessage.id);
      chat.messages = chat.messages.concat(this.modifyNewMessages([directMessage]));
    }));

    this.group.users.forEach(user => {

      this.subscriptions.push(this.userServiceProvider.groupService.getIsUserTyping(user).subscribe(isUserTyping => {

        if (isUserTyping) {
          chat.typingUsers = chat.typingUsers.concat([user]);
        } else {
          chat.typingUsers = chat.typingUsers.filter(typingUser => typingUser.username !== user.username);
        }
      }));
    });


    this.chatUsers.forEach(user => {
      this.addUserToChats(user);
    });

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscrition => {
      subscrition.unsubscribe()
    });
  }

  ngDoCheck() {
    let change: IterableChanges<User> = this.differ.diff(this.chatUsers);
    if (change !== null) {
      change.forEachAddedItem(record => {
        let user = record.item;
        this.addUserToChats(user);
      })
    }
  }

  fetchOlderGroupMessages(chat: Chat) {
    this.userServiceProvider.groupService.getLastNumberOfGroupMessages(this.group.name, chat.threshold, chat.end).subscribe(messages => {

      chat.messages = chat.messages.concat(this.modifyNewMessages(messages));
      chat.threshold += chat.limit;
      chat.end += chat.limit;
    });
  }

  fetchOlderDirectMessages(user: User, chat: Chat): void {
    this.userServiceProvider.userService.getLastNumberOfDirectMessages(user, chat.threshold, chat.end).subscribe(messages => {
      chat.messages = chat.messages.concat(this.modifyNewMessages(messages));
      chat.threshold += chat.limit;
      chat.end += chat.limit;
    })
  };

  addUserToChats(user: User) {
    let chat: Chat = {
      name: user.username,
      limit: this.limit,
      end: this.end,
      threshold: this.threshold,
      closeable: true,
      messages: [],
      typingUsers: [] = [],
      loadOlder: () => {
        this.fetchOlderDirectMessages(user, chat);
      },
      sendMessage: (value) => {
        this.userServiceProvider.userService.sendMessage(value, user);
      },
      editMessage: (message => {
        let directMessage = message as DirectMessage;
        this.userServiceProvider.userService.editMessage(directMessage, user);
      }),
      answerMessage: (answerMessage => {
        this.userServiceProvider.userService.answerMessage(answerMessage, user);
      }),
      reportIfCurrentUserIsTyping: (isTyping => {
        this.userServiceProvider.userService.reportTypingToUser(isTyping, user)
      })
    } as Chat;

    this.chats.push(chat);
    this.fetchOlderDirectMessages(user, chat);
    this.subscriptions.push(this.userServiceProvider.userService.getDirectMessageFromUser(user).subscribe(directMessage => {
      chat.messages = chat.messages.concat(this.modifyNewMessages([directMessage]));
    }));
    this.subscriptions.push(this.userServiceProvider.userService.getResendDirectMessageFromUser(user).subscribe(directMessage => {
      chat.messages = chat.messages.filter(message => message.id !== directMessage.id);
      chat.messages = chat.messages.concat(this.modifyNewMessages([directMessage]));
    }));
    this.subscriptions.push(this.userServiceProvider.userService.getIsUserTyping(user).subscribe(isUserTyping => {
      if (isUserTyping) {
        chat.typingUsers = [user];
      } else {
        chat.typingUsers.splice(0, 1);
      }
    }));
  }

  groupReactionsByEmojis(reactions: Array<UserReaction>): Map<Emoji, Array<UserReaction>> {
    let result = new Map<Emoji, Array<UserReaction>>();
    this.emojis.forEach(emoji => {
      result.set(emoji, reactions.filter(reaction => reaction.emoji === emoji));
    });

    return result;
  }

  private modifyNewMessages(newMessages: Array<Message>): Array<Message> {
    let modifiedMessages: Array<Message> = [];
    newMessages.forEach(message => {
      message.isCurrentUserAuthor = message.author.username === this.currentUser.username;
      if (message.reactions != null) {
        message.emojisGroupedReactions = this.groupReactionsByEmojis(message.reactions);
        let currentUserReactionCandidate = message.reactions.find(reaction => reaction.author.username === this.currentUser.username);
        message.currentUserReaction = isUndefined(currentUserReactionCandidate) ? null : currentUserReactionCandidate;
      } else {
        message.emojisGroupedReactions = new Map<Emoji, Array<UserReaction>>();
        message.currentUserReaction = null;
      }
      modifiedMessages.push(message);

    });
    return modifiedMessages;
  }
}
