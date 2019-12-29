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
  private ownedGroups: Array<Group> = [];
  private participatingGroups: Array<Group> = [];
  private unreadMessages: Map<Group, number> = new Map<Group, number>();

  private user: User;

  constructor(private userServiceProvider: UserServiceProvider) {
    userServiceProvider.groupService.getGroups().pipe(first()).subscribe(groups => {
      userServiceProvider.userService.getUser().subscribe(user => {
        this.user = user;
        for (let group of groups) {
          group.layoutImagePath = this.getLayoutImagePath();
          if (group.owner.username === this.user.username) {
            this.ownedGroups.push(group);
          } else {
            this.participatingGroups.push(group);
          }
        }
      });
      userServiceProvider.groupService.getNewGroup().subscribe(newGroup => {
        if (newGroup.owner.username === this.user.username) {
          this.ownedGroups.push(newGroup);
        } else {
          this.participatingGroups.push(newGroup);
        }
      });
    });

  }

  ngOnInit() {
  }

  getLayoutImagePath(): string {
    return `../../../../assets/group/layouts/teamwork-${Math.floor(Math.random() * 5) + 1}.jpg`;
  }
}
