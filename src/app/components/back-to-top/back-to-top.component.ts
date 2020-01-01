import {Component, HostListener, Inject, Input, OnInit} from '@angular/core';
import {event} from 'd3-selection';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent implements OnInit {

  display: boolean = false;

  constructor() {
  }

  @HostListener('window:scroll') onScroll() {
    if (window.scrollY > window.innerHeight) {
      this.display = true;
    } else {
      this.display = false;
    }
  }

  ngOnInit(): void {
  }

  goToTop() {
    window.scroll(0, 0);
  }
}
