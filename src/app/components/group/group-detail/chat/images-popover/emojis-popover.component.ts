import {Component, EventEmitter, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-emojis-popover',
  templateUrl: './emojis-popover.component.html',
  styleUrls: ['./emojis-popover.component.scss']
})
export class EmojisPopoverComponent implements OnInit {

  @Output() emojiSelected=new EventEmitter();

  private emojisPath: string = './../../../../../assets/emojis/';
 public emojis = [
   {path:`${this.emojisPath}051-angel.svg`,name:'051-angel.svg'},
   {path:`${this.emojisPath}051-angry-1.svg`,name:'051-angry-1.svg'},
   {path:`${this.emojisPath}051-angry.svg`,name:'051-angry.svg'},
   {path:`${this.emojisPath}051-arrogant.svg`,name:'051-arrogant.svg'},
   {path:`${this.emojisPath}051-bored.svg`,name:'051-bored.svg'},
   {path:`${this.emojisPath}051-confused.svg`,name:'051-confused.svg'},
   {path:`${this.emojisPath}051-cool-1.svg`,name:'051-cool-1.svg'},
   {path:`${this.emojisPath}051-cool.svg`,name:'051-cool.svg'},
   {path:`${this.emojisPath}051-crying-1.svg`,name:'051-crying-1.svg'},
   {path:`${this.emojisPath}051-crying-2.svg`,name:'051-crying-2.svg'},
   {path:`${this.emojisPath}051-crying.svg`,name:'051-crying.svg'},
   {path:`${this.emojisPath}051-cute.svg`,name:'051-cute.svg'},
   {path:`${this.emojisPath}051-embarrassed.svg`,name:'051-embarrassed.svg'},
   {path:`${this.emojisPath}051-emoji.svg`,name:'051-emoji.svg'},
   {path:`${this.emojisPath}051-greed.svg`,name:'051-greed.svg'},
   {path:`${this.emojisPath}051-happy-1.svg`,name:'051-happy-1.svg'},
   {path:`${this.emojisPath}051-happy-2.svg`,name:'051-happy-2.svg'},
   {path:`${this.emojisPath}051-happy-3.svg`,name:'051-happy-3.svg'},
   {path:`${this.emojisPath}051-happy-4.svg`,name:'051-happy-4.svg'},
   {path:`${this.emojisPath}051-happy-5.svg`,name:'051-happy-5.svg'},
   {path:`${this.emojisPath}051-happy-6.svg`,name:'051-happy-6.svg'},
   {path:`${this.emojisPath}051-happy-7.svg`,name:'051-happy-7.svg'},
   {path:`${this.emojisPath}051-happy.svg`,name:'051-happy.svg'},
   {path:`${this.emojisPath}051-in-love.svg`,name:'051-in-love.svg'},
   {path:`${this.emojisPath}051-kiss-1.svg`,name:'051-kiss-1.svg'},
   {path:`${this.emojisPath}051-kiss.svg`,name:'051-kiss.svg'},
   {path:`${this.emojisPath}051-laughing-1.svg`,name:'051-laughing-1.svg'},
   {path:`${this.emojisPath}051-laughing-2.svg`,name:'051-laughing-2.svg'},
   {path:`${this.emojisPath}051-laughing.svg`,name:'051-laughing.svg'},
   {path:`${this.emojisPath}051-muted.svg`,name:'051-muted.svg'},
   {path:`${this.emojisPath}051-nerd.svg`,name:'051-nerd.svg'},
   {path:`${this.emojisPath}051-sad-1.svg`,name:'051-sad-1.svg'},
   {path:`${this.emojisPath}051-sad-2.svg`,name:'051-sad-2.svg'},
   {path:`${this.emojisPath}051-sad.svg`,name:'051-sad.svg'},
   {path:`${this.emojisPath}051-scare.svg`,name:'051-scare.svg'},
   {path:`${this.emojisPath}051-serious.svg`,name:'051-serious.svg'},
   {path:`${this.emojisPath}051-shocked.svg`,name:'051-shocked.svg'},
   {path:`${this.emojisPath}051-sick.svg`,name:'051-sick.svg'},
   {path:`${this.emojisPath}051-sleepy.svg`,name:'051-sleepy.svg'},
   {path:`${this.emojisPath}051-smart.svg`,name:'051-smart.svg'},
   {path:`${this.emojisPath}051-surprised-1.svg`,name:'051-surprised-1.svg'},
   {path:`${this.emojisPath}051-surprised-2.svg`,name:'051-surprised-2.svg'},
   {path:`${this.emojisPath}051-surprised-3.svg`,name:'051-surprised-3.svg'},
   {path:`${this.emojisPath}051-surprised-4.svg`,name:'051-surprised-4.svg'},
   {path:`${this.emojisPath}051-surprised.svg`,name:'051-surprised.svg'},
   {path:`${this.emojisPath}051-suspicious.svg`,name:'051-suspicious.svg'},
   {path:`${this.emojisPath}051-thumbs-down.svg`,name:'051-thumbs-down.svg'},
   {path:`${this.emojisPath}051-thumbs-up.svg`,name:'051-thumbs-up.svg'},
   {path:`${this.emojisPath}051-tongue.svg`,name:'051-tongue.svg'},
   {path:`${this.emojisPath}051-vain.svg`,name:'051-vain.svg'},
   {path:`${this.emojisPath}051-wink-1.svg`,name:'051-wink-1.svg'},
   {path:`${this.emojisPath}051-wink.svg`,name:'051-wink.svg'},

  ];
  constructor() {
  }

  ngOnInit() {
  }


}
