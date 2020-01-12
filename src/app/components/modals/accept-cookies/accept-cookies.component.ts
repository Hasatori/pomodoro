import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'angular-bootstrap-md';
import {isUndefined} from 'util';

@Component({
  selector: 'app-accept-cookies',
  templateUrl: './accept-cookies.component.html',
  styleUrls: ['./accept-cookies.component.scss']
})
export class AcceptCookiesComponent implements AfterViewInit {
  // @ts-ignore
  @ViewChild(`frame`) input: ModalDirective;
  private COOKIES_ACCEPTED_KEY: string = 'cookiesAccepted';

  constructor() {
  }


  ngAfterViewInit(): void {
    let cookiesAccepted: boolean =false;
    try {
     cookiesAccepted= JSON.parse(window.localStorage.getItem(this.COOKIES_ACCEPTED_KEY));
    }catch (e) {

    }

    if (isUndefined(cookiesAccepted)||!cookiesAccepted){
      this.input.show();
    }

  }

  agreed() {
    window.localStorage.setItem(this.COOKIES_ACCEPTED_KEY, JSON.stringify(true));
    this.input.hide();
  }
}
