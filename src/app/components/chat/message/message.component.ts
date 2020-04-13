import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../../model/user/user";
import {Message} from "../../../model/message/message";
import {isUndefined} from "util";
import {UserServiceProvider} from "../../../services/user-service-provider";
import {getEnvironment} from "../../../server-config";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() currentUser: User;
  @Input() message: Message;
  @Output() onReact = new EventEmitter();
  @Output() onEditMessage = new EventEmitter();
  @Output() onSendMessage = new EventEmitter();
  showReactions: boolean = false;
  isMobileOrTablet = false;
  reactions: Array<string> =
    [
      'happy',
      'sad',
      'angry',
      'crying',
      'thumbs-up',
      'thumbs-down'
    ];
  private oldMessageTimeOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
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

  constructor(public userServiceProvider: UserServiceProvider, private http: HttpClient) {
  }

  ngOnInit() {
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

  react(emoji: string) {
    this.message.currentUserReaction = emoji;
    this.onReact.emit(emoji);
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

}


