import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../model/user/user";
import {Group} from "../../model/group/group";
import {MessageAttachment} from "../../model/attachment/message-attachment";
import {GroupMessage} from "../../model/message/group-message";
import {Message} from "../../model/message/message";
import {UserReaction} from "../../model/reaction/user-reaction";
import {listAnimation, onCreateListAnimation} from "../../animations";

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss'],
  animations: [listAnimation, onCreateListAnimation]
})
export class CommunicationComponent implements OnInit {
  chatsShown:boolean=false;
  count: number = 0;
  chats = [0,1,2,3,4];
  emojis = [
    Emoji.HAPPY,
    Emoji.SAD,
    Emoji.ANGRY,
    Emoji.CRYING,
    Emoji.THUMBS_UP,
    Emoji.THUMBS_DOWN
  ];
  now: Date = new Date();

  constructor() {

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
    let users=[owner,user,user2];
    for (let i = 0; i < 5; i++) {
      let randomBoolean = Math.random() >= 0.5;
      let groupMessage: GroupMessage = new GroupMessage();
      groupMessage.group = group;
      groupMessage.value = 'currentUserMessage'+this.count;
      groupMessage.id = this.count;
      groupMessage.changes = [];
      groupMessage.author = owner;
      groupMessage.creationTimestamp = new Date();
      groupMessage.creationTimestamp.setDate(this.now.getDate() - this.count);
      groupMessage.shouldShowAuthorsName = true;
      groupMessage.shouldShowAuthorsPhoto = true;
      groupMessage.attachments = [];
      groupMessage.reactions=this.getRandomReactions(users,groupMessage);
      if (randomBoolean) {
        attachment.message = groupMessage;
        attachment.name = 'test.pdf';
        attachment.format = 'pdf';
        groupMessage.attachments = [attachment,attachment];
      }
      this.messages.push(groupMessage);
      this.count++;
      groupMessage.isCurrentUserAuthor=true;
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
      groupMessage.reactions=this.getRandomReactions(users,groupMessage);
      groupMessage.attachments = [];
      if (randomBoolean) {
        attachment.message = groupMessage;
        attachment.name = 'test.png';
        attachment.format = 'png';
        groupMessage.attachments = [attachment,attachment];
      }

      this.messages.push(groupMessage);
      this.count++;
      groupMessage.isCurrentUserAuthor=false;
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
      groupMessage.reactions=this.getRandomReactions(users,groupMessage);
      groupMessage.attachments = [];
      if (randomBoolean) {
        attachment.message = groupMessage;
        attachment.name = 'test.png';
        attachment.format = 'png';
        groupMessage.attachments = [attachment,attachment];
      }

      this.messages.push(groupMessage);
      this.count++;
      groupMessage.isCurrentUserAuthor=false;
    }
    this.currentUser = owner;


  }

  ngOnInit() {
  }

  getRandomReactions(authors:Array<User>,message:Message):Array<UserReaction>{
    let result:Array<UserReaction>=[];
    authors.forEach(author=>{
      let reaction = new UserReaction();
      reaction.author = author;
      reaction.message=message;
      reaction.emoji = this.getRandomEmoji();
      result.push(reaction);
    });
    let emojisGroupedReactions:Map<Emoji,UserReaction[]>=new Map();
    this.emojis.forEach(emoji=>{
      let group=result.filter(reaction=>reaction.emoji===emoji);
      if (group.length>0){
        emojisGroupedReactions.set(emoji,group);
      }
    });
    message.emojisGroupedReactions=emojisGroupedReactions;
    return result;
  }

  getRandomEmoji():Emoji{
    return this.emojis[this.getRandomInt(this.emojis.length)];
  }
  getRandomInt(max):number {
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
    let newMessages: Array<Message> = [];
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
      let attachment:MessageAttachment=new MessageAttachment();
      attachment.message=groupMessage;
      attachment.format="pdf";
      attachment.name="test.pdf";
      groupMessage.attachments=[attachment];
      newMessages.push(groupMessage);
      this.count++;
      groupMessage.isCurrentUserAuthor=true;
    }
    for (let i = 0; i < 5; i++) {
      let groupMessage: GroupMessage = new GroupMessage();
      groupMessage.group = group;
      groupMessage.value = 'xxsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssxx';
      groupMessage.id = this.count;
      groupMessage.changes = [];
      groupMessage.author = user;
      groupMessage.shouldShowAuthorsName = true;
      groupMessage.attachments=[];
      groupMessage.shouldShowAuthorsPhoto = true;
      groupMessage.creationTimestamp = new Date();
      groupMessage.creationTimestamp.setDate(this.now.getDate() - this.count);
      newMessages.push(groupMessage);
      this.count++;
      groupMessage.isCurrentUserAuthor=false;
    }
    this.messages = this.messages.concat(newMessages);

  }

  messages: Array<Message> = [];
  currentUser: User;

}
