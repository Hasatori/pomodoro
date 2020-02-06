import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {map} from 'rxjs/operators';
import {User} from '../../../../model/user';
import {UserFilterPipe} from '../../../../pipes/UserFilter.pipe';
import {UserServiceProvider} from '../../../../services/user-service-provider';
import {Group} from '../../../../model/group';
import {ModalDirective} from 'angular-bootstrap-md';
import {environment} from '../../../../../environments/environment';
import {getEnvironment} from "../../../../ServerConfig";

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit {
  @Input() group: Group;
  @Input() users: Array<User>;
  // @ts-ignore
  @ViewChild('inviteUserFrame') input: ModalDirective;
  allFoundUsers: Array<User> = [];
  usersToDisplay: Array<User> = [];
  searchedUsers: Array<User> = [];
  invitedUsers:Array<User>=[];
  private searchInProgress: boolean;
  selectedUser: User = null;
  success:boolean=false;

  constructor(private http: HttpClient, private userFilter: UserFilterPipe, public userServiceProvider: UserServiceProvider) {
  }


  ngOnInit() {


  }

  searchUsername(hint: string) {
    this.usersToDisplay = this.allFoundUsers;
    if (hint !== '' && !this.allFoundUsers.some(data => data.username.includes(hint)) && !this.searchInProgress) {
      this.searchInProgress = true;
      setTimeout(() => {
        this.http.post<Array<User>>(`${getEnvironment().backend}users-on-hint`, {value: hint}).pipe(map(response => {
          return response;
        })).subscribe(users => {
          this.allFoundUsers = this.allFoundUsers.concat(users);
          this.usersToDisplay = this.allFoundUsers;
          this.searchInProgress = false;
        });
      }, 300);

    }
  }

  selectUser(selectedUser: User, hint: string) {
    this.selectedUser = selectedUser;
    this.searchedUsers = this.userFilter.transform(this.usersToDisplay, hint).filter(user => {
      return user.id !== selectedUser.id;
    });
    this.usersToDisplay = [];
  }

  inviteUser(user: User) {
    this.userServiceProvider.groupService.invitedUserToGroup(user, this.group).subscribe(response => {
      if (response.success !== null) {
        this.invitedUsers.push(user);
      }
    });
  }
  wasInvited(user:User):boolean{
    return this.invitedUsers.some(invitedUser=>invitedUser.id===user.id);
  }
  alreadyMember(user:User):boolean{
    return this.users.some(member=>member.id===user.id);
  }
  show() {
    this.input.show();
     this.userServiceProvider.groupService.getInvitationsForGroup(this.group).subscribe(invitations=>{
       this.invitedUsers=this.invitedUsers.concat(invitations.map(invitation=>invitation.invitedUser));

     });
  }
}
