import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {GroupService} from '../../../services/group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Group} from '../../../model/group';
import {UserService} from '../../../services/user.service';
import {User} from '../../../model/user';
import {UserServiceProvider} from '../../../services/user-service-provider';
import {GroupInvatation} from '../../../model/group-invatation';
import {Observable} from 'rxjs';

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {


  private user: User;

  constructor(private userServiceProvider: UserServiceProvider) {


  }

  ngOnInit() {
  }


}
