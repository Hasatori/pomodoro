import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'angular-bootstrap-md';

@Component({
  selector: 'app-are-you-sure',
  templateUrl: './are-you-sure.component.html',
  styleUrls: ['./are-you-sure.component.scss']
})
export class AreYouSureComponent implements OnInit {
  @Input()heading:string='';
  @Input()important:string='';
  @Input()subheading:string='';
  @Output()onOk:EventEmitter<ModalDirective>=new EventEmitter();

  // @ts-ignore
  @ViewChild('frame') input: ModalDirective;
  constructor() { }


  ngOnInit() {

  }
  show(){
    this.input.show();
  }

}
