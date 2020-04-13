import {Component, OnInit} from '@angular/core';
import {User} from '../../../model/user/user';
import {UserServiceProvider} from '../../../services/user-service-provider';
import {DatePipe} from '@angular/common';
import {listAnimation, onCreateListAnimation} from "../../../animations";
@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations:[listAnimation,onCreateListAnimation]
})
export class OverviewComponent implements OnInit {


  public user: User;

  public pageSize: number = 10;

  public ownedGroupsPage = 1;
  public participatingGroupsPage = 1;
  public invitationsPage = 1;


  constructor(public userServiceProvider: UserServiceProvider, public datePipe: DatePipe) {


  }

  ngOnInit() {
  }


}
