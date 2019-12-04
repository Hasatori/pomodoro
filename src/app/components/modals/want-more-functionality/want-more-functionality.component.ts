import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'angular-bootstrap-md';
import {Modal} from '../modal';

@Component({
  selector: 'app-want-more-functionality',
  templateUrl: './want-more-functionality.component.html',
  styleUrls: ['./want-more-functionality.component.scss']
})
export class WantMoreFunctionalityComponent extends Modal implements AfterViewInit {
  // @ts-ignore
  @ViewChild('frame') input: ModalDirective;

  private WAIT: number = 600000;// 10 Minutes
  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.input.show();
    this.input.onHide.subscribe(() => {
      this.input.config.backdrop = true;
      this.waitAndShowAgain(this.WAIT, this.input);
    });
  }

}
