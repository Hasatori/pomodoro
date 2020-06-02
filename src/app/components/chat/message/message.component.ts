import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {User} from "../../../model/user/user";
import {Message} from "../../../model/message/message";
import {isUndefined} from "util";
import {UserServiceProvider} from "../../../services/user-service-provider";
import {getEnvironment} from "../../../server-config";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {saveAs} from 'file-saver';
import {TooltipDirective} from "ng-uikit-pro-standard";
import {UserReaction} from "../../../model/reaction/user-reaction";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {

  @Input() currentUser: User;
  @Input() message: Message;
  @Input() previousMessage: Message;
  @Input() nextMessage: Message;

  @Output() onEditMessage = new EventEmitter();
  @Output() scrollingDecision = new EventEmitter();
  @Output() onAnswerMessage = new EventEmitter<Message>();
  showReactions: boolean = false;


  positiveScrollingDecisions = [];
  scrollingAlreadyDisable: boolean = false;
  emojisEnum = [
    Emoji.HAPPY,
    Emoji.SAD,
    Emoji.ANGRY,
    Emoji.CRYING,
    Emoji.THUMBS_UP,
    Emoji.THUMBS_DOWN
  ];
  private oldMessageTimeOptions = {weekday: 'short', hour: '2-digit', minute: '2-digit'};
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
  private imageExtensions: Array<string> = ['jpg', 'png', 'gif', 'svg', 'tif'];
  private emojis: Array<any> =
    [
      {name: 'happy', textExpression: ':)'},
      {name: 'sad', textExpression: ':('},
    ];
  imagesWithHeading = [
    {
      img: "https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(63).jpg",
      thumb: "https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(63).jpg",
      description: "Image 1"
    },
    {
      img: "https://mdbootstrap.com/img/Mockups/Lightbox/Original/img%20(66).jpg",
      thumb: "https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(66).jpg",
      description: "Image 2"
    },
    {
      img: "https://mdbootstrap.com/img/Mockups/Lightbox/Original/img%20(65).jpg",
      thumb: "https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(65).jpg",
      description: "Image 3"
    },
    {
      img: "https://mdbootstrap.com/img/Mockups/Lightbox/Original/img%20(67).jpg",
      thumb: "https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(67).jpg",
      description: "Image 4"
    },
    {
      img: "https://mdbootstrap.com/img/Mockups/Lightbox/Original/img%20(68).jpg",
      thumb: "https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(68).jpg",
      description: "Image 5"
    },
    {
      img: "https://mdbootstrap.com/img/Mockups/Lightbox/Original/img%20(64).jpg",
      thumb: "https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(64).jpg",
      description: "Image 6"
    },
    {
      img: "https://mdbootstrap.com/img/Mockups/Lightbox/Original/img%20(69).jpg",
      thumb: "https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(69).jpg",
      description: "Image 7"
    },
    {
      img: "https://mdbootstrap.com/img/Mockups/Lightbox/Original/img%20(59).jpg",
      thumb: "https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(59).jpg",
      description: "Image 8"
    },
    {
      img: "https://mdbootstrap.com/img/Mockups/Lightbox/Original/img%20(70).jpg",
      thumb: "https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(70).jpg",
      description: "Image 9"
    }
  ];

  constructor(private http: HttpClient) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  private getResult(value: number, unit: string): string {
    if (value >= 2) {
      unit = `${unit}s`;
    }
    return `${Math.floor(value)} ${unit} ago`;
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

  addReactionsClicked() {
    if (this.showReactions) {
      this.showReactions = false;
    } else {
      this.showReactions = true;
    }
  }


  getAttachmentIcon(extension: string): string {
    console.log(extension);
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

  isAttachmentImage(attachment: string): boolean {
    let extension = attachment.substr(attachment.lastIndexOf('.') + 1);
    return this.imageExtensions.some(ext => {
      return ext === extension
    });
  }

  downloadAttachment(groupMessage: Message) {
    groupMessage.attachments.forEach(attachment => {
      let endpoint = `${getEnvironment().backend}group/${groupMessage.id}/attachment/${attachment.id}/download`;
      this.http.post(endpoint, {}, {
        responseType: "blob",
        headers: new HttpHeaders().append("Content-Type", "application/json")
      }).subscribe((response) => {
        const file = new File([response], attachment.name);
        saveAs(response, groupMessage.value);
      });
    })

  }

  getInnerHtml(message: string): string {
    for (let emoji of this.emojis) {
      let emojiTextExpression = emoji.textExpression.replace(/(\)|\()/, '\\$1');
      message = message.replace(new RegExp(emojiTextExpression, 'g'), `<img width="18" src="../../../../../assets/emojis/051-${emoji.name}.svg">`);

    }

    return message;

  }

  shouldShowAuthorsPhotograph(currentMessage: Message, nextMessage: Message): boolean {
    return nextMessage == null || nextMessage.author.username !== currentMessage.author.username;

  }

  shouldShowAuthor(currentMessage: Message, previousMessage: Message) {
    return previousMessage == null || previousMessage.author.username !== currentMessage.author.username;

  }

  emitScrollingDecision(scrollingDecision: boolean) {
    if (scrollingDecision) {
      this.positiveScrollingDecisions.push(true);
    } else {
      this.positiveScrollingDecisions.splice(-1, 1);
    }
    let disable = this.positiveScrollingDecisions.length > 0;
    if (!this.scrollingAlreadyDisable) {
      this.scrollingDecision.emit(disable);
      this.scrollingAlreadyDisable = true;
    } else if (!disable) {
      this.scrollingDecision.emit(disable);
      this.scrollingAlreadyDisable = false;
    }
  }

  isPreviousMessageTooOld(): boolean {
    if (this.previousMessage === null) {
      return true;
    } else {
      return (new Date(this.message.creationTimestamp).getTime() - new Date(this.previousMessage.creationTimestamp).getTime()) > 21600000
    }
  }

  getOldMessageTime(): string {
    return new Date(this.message.creationTimestamp).toLocaleDateString('en-US', this.oldMessageTimeOptions)
  }

  react(emoji: Emoji) {
    console.log(emoji);
    if (this.message.currentUserReaction == null) {
      let reaction: UserReaction = new UserReaction();
      reaction.author = this.currentUser;
      reaction.emoji = emoji;
      reaction.messageId = this.message.id;
      reaction.readTimestamp = null;
      this.message.reactions = [reaction];
      this.message.emojisGroupedReactions.set(emoji, [reaction]);
      this.message.currentUserReaction = reaction;
    } else {
      let currentEmoji = this.message.currentUserReaction.emoji;
      let groupedReactions = this.message.emojisGroupedReactions.get(currentEmoji);
      this.message.emojisGroupedReactions.set(currentEmoji, groupedReactions.filter(userReaction => userReaction.author.username !== this.message.currentUserReaction.author.username));
      this.message.reactions.find(userReaction => userReaction.author.username === this.currentUser.username).emoji = emoji;
      this.message.currentUserReaction.emoji = emoji;
      groupedReactions = this.message.emojisGroupedReactions.get(emoji);
      if (isUndefined(groupedReactions)) {
        groupedReactions = [];
        this.message.emojisGroupedReactions.set(emoji, groupedReactions);
      }
      groupedReactions.push(this.message.currentUserReaction);
    }
    this.onEditMessage.emit(this.message);
  }

  getRepliedMessageHeader(): string {
    if (this.message.author.username === this.currentUser.username) {
      return "You replied to your message"
    } else if (this.message.repliedMessage.author.username === this.currentUser.username) {
      return `${this.message.author.username} replied you`
    } else if (this.message.repliedMessage.author.username === this.message.author.username) {
      return `${this.message.author.username} replied message`
    } else {
      return `${this.message.author.username} replied ${this.message.repliedMessage.author.username}`
    }
  }
}


