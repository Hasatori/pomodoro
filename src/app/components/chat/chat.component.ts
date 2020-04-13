import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from "../../model/message/message";
import {UserServiceProvider} from "../../services/user-service-provider";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() messages: Array<Message>;
  @Input() minimized:boolean;
  @Output() onLoadOlder = new EventEmitter();
  @Output() onSendMessage = new EventEmitter();
  @Output() onEditMessage = new EventEmitter();
  @Output() onReact = new EventEmitter();

  loading:boolean;

  constructor(public userServiceProvider:UserServiceProvider) {
  }

  ngOnInit() {
  }

}
