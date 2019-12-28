import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {GroupService} from '../../../services/group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Group} from '../../../model/group';
import {UserService} from '../../../services/user.service';
import {User} from '../../../model/user';

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

  constructor(private groupService: GroupService, private userService: UserService) {
    this.groupService.getGroups().pipe(first()).subscribe(groups => {
      this.userService.getUser().subscribe(user => {
        this.user = user;
        for (let group of groups) {
          if (group.owner.username === this.user.username) {
            this.ownedGroups.push(group);
          } else {
            this.participatingGroups.push(group);
          }
        }
      });
      groupService.getNewGroup().subscribe(newGroup => {
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

}
