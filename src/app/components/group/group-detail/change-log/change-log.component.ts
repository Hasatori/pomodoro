import {AfterViewInit, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {UserServiceProvider} from '../../../../services/user-service-provider';
import {GroupChange} from '../../../../model/group-change';
import {Group} from '../../../../model/group';
import {Subscription} from 'rxjs';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.scss'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({transform: 'scale(0.5)', opacity: 0}),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({transform: 'scale(1)', opacity: 1}))  // final
      ]),
      transition(':leave', [
        style({transform: 'scale(1)', opacity: 1, height: '*'}),
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({
            transform: 'scale(0.5)', opacity: 0,
            height: '0px', margin: '0px'
          }))
      ])
    ]),
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(200, animateChild()))
      ]),
    ])
  ]
})
export class ChangeLogComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() group: Group;
  @ViewChildren('changes') changesContainer: QueryList<any>;
  changesContainerLength: number = 0;
  fetchingOlder: boolean = false;
  olderFetched: boolean = false;
  stopFetchingOlder: boolean = false;
  init: boolean = false;
  private changes: Array<GroupChange>;
  private threshold = 0;
  private limit = 10;
  private end = this.threshold + this.limit;
  private newGroupChangeSubscription: Subscription;

  headElements: Array<HeadElement> = [
    {
      id: 0,
      value: 'Change timestamp',
      sortBy: 'changeTimestamp',
      sortedAsc: false
    },
    {
      id: 1,
      value: 'Author',
      sortBy: 'changeAuthor.username',
      sortedAsc: true
    },
    {
      id: 2,
      value: 'Change type',
      sortBy: 'changeType',
      sortedAsc: true
    },
    {
      id: 3,
      value: 'Change description',
      sortBy: 'changeDescription',
      sortedAsc: true
    },
  ];
  private scrollableWindow: HTMLElement;
  private realScrollHeight: number = 0;

  constructor(private userServiceProvider: UserServiceProvider, public datepipe: DatePipe) {
  }

  ngOnInit() {
    this.userServiceProvider.groupService.getLastNumberOfGroupChanges(this.group.name, this.threshold, this.end).subscribe((changes) => {
      this.changes = [];
      this.changes = changes.sort(function(a, b) {
        return new Date(b.changeTimestamp).getTime() - new Date(a.changeTimestamp).getTime();
      });
      this.threshold += this.limit;
      this.end += this.limit;

      this.init = true;
    });
    this.newGroupChangeSubscription = this.userServiceProvider.groupService.getNewGroupChange(this.group.name).subscribe(change => {
      this.changes.push(change);
      this.changes = this.changes.sort(function(a, b) {
        return new Date(b.changeTimestamp).getTime() - new Date(a.changeTimestamp).getTime();
      });
      this.sort(0, true);
    });

  }

  sort(id: number, asc: boolean) {
    let rest = this.headElements.filter(element => element.id !== id);
    rest.forEach(element => element.sortedAsc = true);
    this.headElements.find(element => element.id === id).sortedAsc = asc;
  }

  ngOnDestroy(): void {
    this.newGroupChangeSubscription.unsubscribe();
  }

  scrolled() {
    if (this.realScrollHeight===0){
      this.realScrollHeight = this.scrollableWindow.scrollHeight - this.scrollableWindow.clientHeight;
    }
    if (!this.init) {
      this.scrollableWindow.scrollTop =this.realScrollHeight-5;
    }
    console.log(this.realScrollHeight);
    if ((this.realScrollHeight == this.scrollableWindow.scrollTop) && !this.stopFetchingOlder) {
      this.fetchingOlder = true;
      console.log('fetching older');
      setTimeout(() => {
        this.userServiceProvider.groupService.getLastNumberOfGroupChanges(this.group.name, this.threshold, this.end).subscribe((changes) => {
          if (changes.length > 0) {
            this.changes = this.changes.concat(changes);

            this.changes.sort(function(a, b) {
              return new Date(b.changeTimestamp).getTime() - new Date(a.changeTimestamp).getTime();
            });
            this.threshold += this.limit;
            this.end += this.limit;

            this.fetchingOlder = false;
            this.olderFetched = true;
          } else {
            this.fetchingOlder = false;
            this.stopFetchingOlder = true;
          }
        });
      }, 500);

    }
  }

  ngAfterViewInit(): void {
    this.scrollableWindow = document.getElementById('scrollable-table');

    this.changesContainer.changes.subscribe(t => {
      let currentLength = t._results.length;
      if (currentLength !== this.changesContainerLength) {
        this.changesContainerLength = currentLength;

        if (!this.fetchingOlder && !this.olderFetched) {
          this.scrollableWindow.scrollTop =this.realScrollHeight-1;

        }
        if (this.olderFetched) {
          this.olderFetched = false;
        }
      }


    });
  }
}

interface HeadElement {
  id: number;
  value: string;
  sortBy: string;
  sortedAsc: boolean;
}
