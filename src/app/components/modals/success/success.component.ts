import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Modal} from '../modal';
import {ModalDirective} from 'angular-bootstrap-md';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent extends Modal {
  // @ts-ignore
  @ViewChild('centralModalSuccess') successModal: ModalDirective;
  header: string;
  message: string;

  constructor() {
    super();
  }

  show(header: string, message: string) {
    this.header = header;
    this.message = message;
    this.successModal.show();

  }
  onHide():Observable<any>{
    return this.successModal.onHide;

  }
}
