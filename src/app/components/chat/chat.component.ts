import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output,
  QueryList, SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Message} from "../../model/message/message";
import {UserServiceProvider} from "../../services/user-service-provider";
import {isUndefined} from "util";
import {User} from "../../model/user/user";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {of} from "rxjs";
import {listAnimation, onCreateListAnimation} from "../../animations";
import {Observable} from "rxjs/internal/Observable";
import {MessageAnswer} from "../../model/message/message-answer";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [listAnimation, onCreateListAnimation]
})
export class ChatComponent implements OnInit, OnChanges {

  @Input() chatName: string;
  @Input() messages: Array<Message>;
  @Input() minimized: boolean;
  @Input() numberOfUnreadMessages: number = 0;
  @Input() user: User;
  @Input() typingUsers: Array<User>;
  @Input() chatMuted: boolean;
  @Input() closeable: boolean;
  @Output() onLoadOlder = new EventEmitter();
  @Output() onEditMessage = new EventEmitter<Message>();
  @Output() onSendMessage = new EventEmitter<string>();
  @Output() onAnswerMessage = new EventEmitter<MessageAnswer>();
  @Output() onRemove = new EventEmitter();
  @Output() isUserTyping = new EventEmitter();

  answeringMessage: Message = null;

  loading: boolean;
  init: boolean = false;
  showReactions: boolean;
  stopScrolling: boolean = false;
  seenBy: string;
  lastCursorPosition: number = 0;
  scrollingDecisions = [];
  messagesContainerLength: number = 0;

  @ViewChildren('messages') messagesContainer: QueryList<any>;
  @ViewChild(CdkVirtualScrollViewport, {static: false}) scrollableWindow: CdkVirtualScrollViewport;

  fetchingOlder: boolean = false;
  private threshold = 0;
  private limit = 10;
  private end = this.threshold + this.limit;
  private scrollableElement: HTMLElement;

  constructor(public userServiceProvider: UserServiceProvider) {
    this.loading = true;

  }

  ngOnInit() {
    if (!isUndefined(this.messages) && this.messages != null && !isUndefined(this.user) && this.user != null) {

      this.loading = false;
    }

  }


  getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;

      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);

      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  addEmoji(message: HTMLDivElement, emoji: string) {
    console.log(this.lastCursorPosition);
    let image = `<img width="18" src="../../../../../assets/emojis/${emoji}">`;
    message.innerHTML = message.innerHTML.substr(0, this.lastCursorPosition) + image + message.innerHTML.substr(this.lastCursorPosition, message.innerHTML.length);
    this.lastCursorPosition = this.lastCursorPosition + image.length;
  }

  scrolled(index) {
    if (this.init) {
      if (index <= 4 && this.fetchingOlder === false) {
        this.fetchingOlder = true;
        this.onLoadOlder.emit();
        this.fetchingOlder = false;
        this.scrollableWindow.scrollToIndex(4);
      }
    }
  }

  getMessage(index: number): Message {
    if (index >= 0 && index < this.messages.length) {
      return this.messages[index];
    }
    return null;
  }

  addScrollingDecision(scrollingDecision: boolean) {
    console.log(scrollingDecision);
    if (scrollingDecision) {
      this.scrollingDecisions.push(true);
    } else {
      this.scrollingDecisions.splice(-1, 1);
    }
    this.stopScrolling = this.scrollingDecisions.length > 0;
    console.log(this.scrollingDecisions);
  }


  scrollToBottom(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let end = 1;
      for (let i = 0; i <= end; i++) {
        setTimeout(() => {
          this.scrollableWindow.scrollToIndex(this.scrollableWindow.getDataLength());
          if (i == end) {
            resolve();
          }
        }, 100);
      }

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.messages.firstChange) {
      this.scrollToBottom().then(() => {
        this.init = true;
      });
    }
  }

  resolveIsUserTyping(value: string) {
    console.log(value);
    let isUserTyping = false;
    if (value.length > 1) {
      isUserTyping = true;
    }
    console.log(isUserTyping);
    this.isUserTyping.emit(isUserTyping);
  }

  sendMessage(value: string) {
    if (this.answeringMessage != null) {
      let messageAnswer = new MessageAnswer();
      messageAnswer.answeredMessage = this.answeringMessage;
      messageAnswer.answerValue = value;
      this.onAnswerMessage.emit(messageAnswer);
      this.answeringMessage=null;
    } else {
      this.onSendMessage.emit(value);
    }

  }
}


