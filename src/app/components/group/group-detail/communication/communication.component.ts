import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {listAnimation, onCreateListAnimation} from "../../../../animations";
import {User} from "../../../../model/user/user";
import {Group} from "../../../../model/group/group";
import {MessageAttachment} from "../../../../model/attachment/message-attachment";
import {GroupMessage} from "../../../../model/message/group-message";
import {UserReaction} from "../../../../model/reaction/user-reaction";
import {Message} from "../../../../model/message/message";
import {Subscription} from "rxjs/index";
import {SecureImagePipe} from "../../../../pipes/secure-image.pipe";
import {HttpClient} from "@angular/common/http";
import {UserServiceProvider} from "../../../../services/user-service-provider";
import {CachedImagePipe} from "../../../../pipes/cached-image.pipe";

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss'],
  animations: [listAnimation, onCreateListAnimation]
})
export class CommunicationComponent implements OnInit, OnDestroy {

  @Input() group: Group;
  @Input() users: Array<User>;

  subsciptions: Array<Subscription> = [];
  groupMessages: Array<GroupMessage> = [];
  currentUser: User;


  chatsShown: boolean = false;
  count: number = 0;
  chats = [];
  emojis = [
    Emoji.HAPPY,
    Emoji.SAD,
    Emoji.ANGRY,
    Emoji.CRYING,
    Emoji.THUMBS_UP,
    Emoji.THUMBS_DOWN
  ];
  now: Date = new Date();

  constructor(private http: HttpClient, public userServiceProvider: UserServiceProvider, public secureImage: SecureImagePipe, public cachedImage: CachedImagePipe) {

    let owner: User = new User();
    owner.id = 1;
    owner.username = 'Hasatori';
    let user: User = new User();
    user.id = 1;
    user.username = 'Test';
    let user2: User = new User();
    user2.id = 2;
    user2.username = 'Test2';
    let group: Group = new Group();
    group.id = 5;
    group.name = 'test';
    group.description = 'description';
    group.isPublic = false;
    group.owner = owner;
    let attachment = new MessageAttachment();
    let users = [owner, user, user2];
    for (let i = 0; i < 5; i++) {
      let randomBoolean = Math.random() >= 0.5;
      let groupMessage: GroupMessage = new GroupMessage();
      groupMessage.group = group;
      groupMessage.value = 'currentUserMessage' + this.count;
      groupMessage.id = this.count;
      groupMessage.changes = [];
      groupMessage.author = owner;
      groupMessage.creationTimestamp = new Date();
      groupMessage.creationTimestamp.setDate(this.now.getDate() - this.count);
      groupMessage.shouldShowAuthorsName = true;
      groupMessage.shouldShowAuthorsPhoto = true;
      groupMessage.attachments = [];
      groupMessage.reactions = this.getRandomReactions(users, groupMessage);
      if (randomBoolean) {
        attachment.message = groupMessage;
        attachment.name = 'test.pdf';
        attachment.format = 'pdf';
        groupMessage.attachments = [attachment, attachment];
      }
      this.groupMessages.push(groupMessage);
      this.count++;
      groupMessage.isCurrentUserAuthor = true;
    }

    for (let i = 0; i < 5; i++) {
      let randomBoolean = Math.random() >= 0.5;
      let groupMessage: GroupMessage = new GroupMessage();
      groupMessage.group = group;
      groupMessage.value = 'otherUser' + this.count;
      groupMessage.id = this.count;
      groupMessage.changes = [];
      groupMessage.author = user;
      groupMessage.shouldShowAuthorsName = true;
      groupMessage.shouldShowAuthorsPhoto = true;
      groupMessage.creationTimestamp = new Date();
      groupMessage.creationTimestamp.setDate(this.now.getDate() - this.count);
      groupMessage.reactions = this.getRandomReactions(users, groupMessage);
      groupMessage.attachments = [];
      if (randomBoolean) {
        attachment.message = groupMessage;
        attachment.name = 'test.png';
        attachment.format = 'png';
        groupMessage.attachments = [attachment, attachment];
      }

      this.groupMessages.push(groupMessage);
      this.count++;
      groupMessage.isCurrentUserAuthor = false;
    }
    for (let i = 0; i < 5; i++) {
      let randomBoolean = Math.random() >= 0.5;
      let groupMessage: GroupMessage = new GroupMessage();
      groupMessage.group = group;
      groupMessage.value = 'otherUser' + this.count;
      groupMessage.id = this.count;
      groupMessage.changes = [];
      groupMessage.author = user2;
      groupMessage.shouldShowAuthorsName = true;
      groupMessage.shouldShowAuthorsPhoto = true;
      groupMessage.creationTimestamp = new Date();
      groupMessage.creationTimestamp.setDate(this.now.getDate() - this.count);
      groupMessage.reactions = this.getRandomReactions(users, groupMessage);
      groupMessage.attachments = [];
      if (randomBoolean) {
        attachment.message = groupMessage;
        attachment.name = 'test.png';
        attachment.format = 'png';
        groupMessage.attachments = [attachment, attachment];
      }

      this.groupMessages.push(groupMessage);
      this.count++;
      groupMessage.isCurrentUserAuthor = false;
    }
    this.currentUser = owner;


  }

  ngOnInit() {
    /* this.loading = true;
     this.markAllAsReadAndProcessResponse();
     this.userServiceProvider.userService.getUser().subscribe((user) => {
       this.user = user;

     });
     this.subsciptions.push(this.userServiceProvider.groupService.getNewGroupMessage(this.group.name).subscribe((newMessage) => {
       this.addingNewMessage = true;
       this.seenBy = '';
       this.setReactionsForMessage(newMessage);
       this.groupMessages = this.groupMessages.concat(newMessage);
       this.processMessagesFromBack(this.groupMessages);

     }));
     this.subsciptions.push(this.userServiceProvider.groupService.getResendGroupMessage(this.group.name).subscribe((newMessage) => {
       this.addingNewMessage = true;
       this.seenBy = '';
       this.groupMessages.push(newMessage);
       this.processMessagesFromBack(this.groupMessages);
     }));
     this.subsciptions.push(this.userServiceProvider.groupService.getReactedGroupMessage(this.group.name).subscribe((reactedMessage) => {
       let foundMessage = this.groupMessages.find(message => {
         return message.id === reactedMessage.id;
       });
       if (!isUndefined(foundMessage)) {
         this.setReactionsForMessage(reactedMessage);
         foundMessage.reactions = reactedMessage.reactions;
         let reaction = foundMessage.reactions.find(r => {
           return r.author.username === this.user.username;
         });
         //    foundMessage.currentUserReaction = isUndefined(reaction) ? null : reaction.emoji;
       }
     }));
     this.subsciptions.push(this.userServiceProvider.groupService.getLastNumberOfGroupMessages(this.group.name, this.threshold, this.end).subscribe((response) => {
       this.addingNewMessage = true;
       this.groupMessages = response.sort(function (a, b) {
         return new Date(a.creationTimestamp).getTime() - new Date(b.creationTimestamp).getTime();
       });
       for (let i = 0; i < this.groupMessages.length; i++) {
         let message = this.groupMessages[i];
         this.setReactionsForMessage(message);
         message.shouldShowAuthorsName = this.shouldShowAuthor(message, i - 1 !== 0 ? this.groupMessages[i - 1] : null);
         message.shouldShowAuthorsPhoto = this.shouldShowAuthorsPhotograph(message, i < this.groupMessages.length - 1 ? this.groupMessages[i + 1] : null);
       }
       this.threshold += this.limit;
       this.end += this.limit;
       this.loading = false;
     }));*/

    this.users.forEach(user => {
      this.subsciptions.push(this.userServiceProvider.userService.getDirectMessage(user).subscribe(directMessage => {

      }))
    });
  }

  getRandomReactions(authors: Array<User>, message: Message): Array<UserReaction> {
    let result: Array<UserReaction> = [];
    authors.forEach(author => {
      let reaction = new UserReaction();
      reaction.author = author;
      reaction.message = message;
      reaction.emoji = this.getRandomEmoji();
      result.push(reaction);
    });
    let emojisGroupedReactions: Map<Emoji, UserReaction[]> = new Map();
    this.emojis.forEach(emoji => {
      let group = result.filter(reaction => reaction.emoji === emoji);
      if (group.length > 0) {
        emojisGroupedReactions.set(emoji, group);
      }
    });
    message.emojisGroupedReactions = emojisGroupedReactions;
    return result;
  }

  getRandomEmoji(): Emoji {
    return this.emojis[this.getRandomInt(this.emojis.length)];
  }

  getRandomInt(max): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  removeFromChat(value: number) {
    this.chats = this.chats.filter(chatValue => chatValue !== value);
  }

  addToChat() {
    this.chats.push(this.chats.length + 1);
  }

  loadOlder() {

    let owner: User = new User();
    owner.id = 1;
    owner.username = 'Hasatori';
    let user: User = new User();
    user.id = 1;
    user.username = 'Test';
    let group: Group = new Group();
    group.id = 5;
    group.name = 'test';
    group.description = 'description';
    group.isPublic = false;
    group.owner = owner;
    let newMessages: Array<GroupMessage> = [];
    for (let i = 0; i < 5; i++) {
      let groupMessage: GroupMessage = new GroupMessage();
      groupMessage.group = group;
      groupMessage.value = 'qqqsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssq';
      groupMessage.id = i;
      groupMessage.changes = [];
      groupMessage.author = owner;
      groupMessage.shouldShowAuthorsName = true;
      groupMessage.shouldShowAuthorsPhoto = true;
      groupMessage.creationTimestamp = new Date();
      groupMessage.creationTimestamp.setDate(this.now.getDate() - this.count);
      let attachment: MessageAttachment = new MessageAttachment();
      attachment.message = groupMessage;
      attachment.format = "pdf";
      attachment.name = "test.pdf";
      groupMessage.attachments = [attachment];
      newMessages.push(groupMessage);
      this.count++;
      groupMessage.isCurrentUserAuthor = true;
    }
    for (let i = 0; i < 5; i++) {
      let groupMessage: GroupMessage = new GroupMessage();
      groupMessage.group = group;
      groupMessage.value = 'xxsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssxx';
      groupMessage.id = this.count;
      groupMessage.changes = [];
      groupMessage.author = user;
      groupMessage.shouldShowAuthorsName = true;
      groupMessage.attachments = [];
      groupMessage.shouldShowAuthorsPhoto = true;
      groupMessage.creationTimestamp = new Date();
      groupMessage.creationTimestamp.setDate(this.now.getDate() - this.count);
      newMessages.push(groupMessage);
      this.count++;
      groupMessage.isCurrentUserAuthor = false;
    }
    this.groupMessages = this.groupMessages.concat(newMessages);

  }


  sendMessageToUser(user:User,value:String){
    this.userServiceProvider.webSocketProxyService.publish('/app/user/' + user.username + '/chat', value);
  }

  ngOnDestroy(): void {
    this.subsciptions.forEach(subscrition => {
      subscrition.unsubscribe()
    });
  }

}
