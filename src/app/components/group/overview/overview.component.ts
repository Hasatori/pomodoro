import {Component, OnInit} from '@angular/core';
import {User} from '../../../model/user';
import {UserServiceProvider} from '../../../services/user-service-provider';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({transform: 'scale(0.5)', opacity: 0}),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({transform: 'scale(1)', opacity: 1}))  // final
      ]),
      transition(':leave', [
        style({transform: 'scale(1)', opacity: 1, height: '*'}),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({transform: 'scale(0)', opacity: 1}))  // final
      ])
    ])
  ]
})
export class OverviewComponent implements OnInit {


  private user: User;

  private pageSize: number = 10;

  private ownedGroupsPage = 1;
  private participatingGroupsPage = 1;
  private invitationsPage = 1;


  constructor(private userServiceProvider: UserServiceProvider, private datePipe: DatePipe) {


  }

  ngOnInit() {
  }


}
