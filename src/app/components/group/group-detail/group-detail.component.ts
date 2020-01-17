import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../../model/group';
import {first, map} from 'rxjs/operators';
import {User} from '../../../model/user';

import {HttpClient} from '@angular/common/http';

import {NGXLogger} from 'ngx-logger';

import {UserServiceProvider} from '../../../services/user-service-provider';


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent {
  private group: Group;
  private groupName: string;
  private allUsers: Array<User>;
  private user: User;
  membersVisible: boolean = true;
  toDoVisible: boolean =true;
  changeLogVisible: boolean = true;
  isOwner: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private log: NGXLogger, private userServiceProvider: UserServiceProvider) {
    this.route.paramMap.subscribe(groupName => {
      this.groupName = groupName.get('name');
      this.userServiceProvider.groupService.getGroups().subscribe((groups) => {
        this.group = groups.find((group) => group.name === this.groupName);
        this.userServiceProvider.userService.getUser().subscribe((user) => {
          this.user = user;
          this.isOwner = this.group.owner.username === this.user.username;
          this.userServiceProvider.groupService.getUsersForGroup(this.groupName).pipe(first()).subscribe(users => {
            this.allUsers = users.filter(user => user.username !== this.user.username);

          });

        });


      });
    });
  }

}
