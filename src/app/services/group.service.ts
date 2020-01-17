import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Group} from '../model/group';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {Pomodoro} from '../model/pomodoro';
import {SERVER_URL} from '../ServerConfig';
import {GroupMessage} from '../model/group-message';
import {WebSocketProxyService} from './web-socket-proxy.service';
import {UserService} from './user.service';
import {GroupInvatation} from '../model/group-invatation';
import {isUndefined} from 'util';
import {UserServiceProvider} from './user-service-provider';
import {GroupChange} from '../model/group-change';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private GROUPS_KEY: string = 'userGroups';
  private GROUP_USERS_KEY: string = 'groupUsers';
  private USER_POMODORO_KEY: string = 'userPomodoro';
  private audio: HTMLAudioElement;
  private SOUNDS_PATH: string = '../assets/sounds/';
  private messageCameSoundName: string = 'deduction.mp3';
  private user: User;
  public allUnreadMessages: number = 0;
  public groupUnreadMessages: Map<string, number> = new Map<string, number>();

  public ownedGroupsUnreadMessages: number = 0;
  public notOwnedGroupsUnreadMessages: number = 0;
  public numberOfNotAcceptedGroupInvitations: number = 0;
  public invitations: Array<GroupInvatation> = [];

  public groups: Array<Group> = [];
  public ownedGroups: Array<Group> = [];
  public participatingGroups: Array<Group> = [];

  constructor(private http: HttpClient, private webSocketProxyService: WebSocketProxyService, private userService: UserService) {
  }

  private reset() {
    this.groups = [];
    this.ownedGroups = [];
    this.participatingGroups = [];
    this.invitations = [];
    this.allUnreadMessages = 0;
    this.groupUnreadMessages = new Map<string, number>();
    this.ownedGroupsUnreadMessages = 0;
    this.notOwnedGroupsUnreadMessages = 0;
    this.numberOfNotAcceptedGroupInvitations = 0;
  }

  startSockets() {
    this.reset();
    this.audio = document.createElement('audio');
    this.audio.setAttribute('src', this.SOUNDS_PATH + this.messageCameSoundName);
    this.userService.getUser().subscribe((user) => {
      this.user = user;

    });
    this.getGroups().subscribe((groups) => {
      this.groups = groups;
      this.userService.getUser().subscribe(user => {
        this.user = user;
        let count = 1;
        for (let group of groups) {
          if (count < 5) {
            group.layoutImagePath = this.getLayoutImagePath(count);
          } else {
            group.layoutImagePath = this.getLayoutImagePath(Math.floor(Math.random() * 5) + 1);
          }

          if (group.owner.username === this.user.username) {
            this.ownedGroups.push(group);
          } else {
            this.participatingGroups.push(group);
          }
          count++;
        }
      });
      this.getNewGroup().subscribe(newGroup => {
        if (newGroup.owner.username === this.user.username) {
          this.ownedGroups.push(newGroup);
        } else {
          this.participatingGroups.push(newGroup);
        }
      });
      for (let group of groups) {
        this.groupUnreadMessages.set(group.name, 0);
        this.getAllUnreadMessagesForGroup(group.name).subscribe(messages => {
          let numberToSet = messages.length;
          if (isNaN(numberToSet)) {
            numberToSet = 0;
          }
          this.groupUnreadMessages.set(group.name, numberToSet);
          this.allUnreadMessages += numberToSet;
          if (group.owner.username === this.user.username) {
            this.ownedGroupsUnreadMessages += numberToSet;
          } else {
            this.notOwnedGroupsUnreadMessages += numberToSet;
          }

        });
        this.getNewGroupMessage(group.name).subscribe(message => {
          if (message.author.username !== this.user.username) {
            this.audio.play();
            this.allUnreadMessages++;
            this.groupUnreadMessages.set(group.name, this.groupUnreadMessages.get(group.name) + 1);
            if (group.owner.username === this.user.username) {
              this.ownedGroupsUnreadMessages++;
            } else {
              this.notOwnedGroupsUnreadMessages++;
            }

          }
        });
      }
    });
    this.getNotAcceptedGroupInvitations().subscribe(groupInvitations => {
      this.invitations = groupInvitations;
      this.numberOfNotAcceptedGroupInvitations = groupInvitations.length;
    });
  }

  getLayoutImagePath(number: number): string {
    return `../../../../assets/group/layouts/teamwork-${number}.jpg`;
  }

  private getAllUnreadMessagesForGroup(groupName: string): Observable<Array<GroupMessage>> {
    return this.http.post<any>(`${SERVER_URL}/groups/${groupName}/fetch-unread-messages`, {
      groupName: groupName,
    }).pipe(map(response => {
      return response;
    }));
  }

  markAllFromGroupAsRead(groupName: string): Observable<GroupMessage> {
    this.allUnreadMessages -= this.groupUnreadMessages.get(groupName);
    this.groupUnreadMessages.set(groupName, 0);
    return this.http.post<any>(`${SERVER_URL}/groups/${groupName}/mark-all-as-read`, {}).pipe(map(response => {
      return response;
    }));
  }

  public getGroups(): Observable<Array<Group>> {
    let groups: Array<Group> = JSON.parse(window.sessionStorage.getItem(this.GROUPS_KEY));
    if (groups != null) {
      return of(groups);
    } else {
      return this.http.post<any>(`${SERVER_URL}/groups`, '').pipe(map(groups => {
        sessionStorage.setItem(this.GROUPS_KEY, JSON.stringify(groups));
        return groups;
      }));
    }
  }

  public getUsersForGroup(groupName: string): Observable<Array<User>> {
    let groupUsers: Array<User> = JSON.parse(window.sessionStorage.getItem(this.createParameterizedKey(this.GROUP_USERS_KEY, groupName)));
    if (groupUsers != null) {
      return of(groupUsers);
    } else {
      return this.http.post<any>(`${SERVER_URL}/groups/` + groupName, '').pipe(map(users => {
        sessionStorage.setItem(this.createParameterizedKey(this.GROUP_USERS_KEY, groupName), JSON.stringify(users));
        return users;
      }));
    }
  }

  public getLastPomodoroForUser(userName: string): Observable<Pomodoro> {
    return this.http.post<any>(`${SERVER_URL}/groups/update/` + userName, '').pipe(map(pomodoro => {
      return pomodoro;
    }));

  }

  public getLastNumberOfGroupMessages(groupName: string, start: number, stop: number): Observable<Array<GroupMessage>> {
    return this.http.post<any>(`${SERVER_URL}/groups/${groupName}/fetch-chat-messages`, {
      groupName: groupName,
      start: start,
      stop: stop
    }).pipe(map(response => {
      console.log(response);
      return response;
    }));

  }

  public getLastNumberOfGroupChanges(groupName: string, start: number, stop: number): Observable<Array<GroupChange>> {
    return this.http.post<any>(`${SERVER_URL}/groups/${groupName}/fetch-changes`, {
      groupName: groupName,
      start: start,
      stop: stop
    }).pipe(map(response => {
      console.log(response);
      return response;
    }));

  }

  public reactToGroupMessage(groupName: string, groupMessage: GroupMessage, reaction: string) {
    let groupMessageReaction = {
      groupMessageId: groupMessage.id,
      reaction: reaction
    };
    this.webSocketProxyService.publish('/app/group/' + groupName + '/chat/reaction', JSON.stringify(groupMessageReaction));
  }

  public getReactedGroupMessage(groupName: string): Observable<GroupMessage> {
    return this.webSocketProxyService.watch('/group/' + groupName + '/chat/reaction').pipe(map(newMessage => {
      return JSON.parse(newMessage.body);
    }));
  }

  createGroup(name: string, isPublic: boolean): Observable<any> {
    return this.http.post<any>(`${SERVER_URL}/group/create`, {
      name: name,
      isPublic: isPublic
    }).pipe(map(response => {
      sessionStorage.setItem(this.GROUPS_KEY, JSON.stringify(null));
      return response;
    }));
  }


  addUser(username: string, groupName: string) {
/*    let groupRequest = {
      username: username,
      groupName: groupName
    };
    this.webSocketProxyService.publish('/app/group/' + groupName + '/group-members', JSON.stringify(groupRequest));
  */  this.sendChange(groupName,`${this.user.username} has invited ${username}`)
  }

  private sendChange(groupName: string, changeDescription: string) {
    this.webSocketProxyService.publish('/app/group/' + groupName + '/change', changeDescription);
  }

  removeUser(username: string, groupName: string): Observable<any> {
    return this.http.post<any>(`${SERVER_URL}/group/removeUser`, {
      username: username, groupName: groupName
    }).pipe(map(response => {
      this.sendChange(groupName,`${this.user.username} has removed ${username} from the group`)
      return response;
    }));

  }

  getNewGroupMessage(groupName: string): Observable<GroupMessage> {
    return this.webSocketProxyService.watch('/group/' + groupName + '/chat').pipe(map(newMessage => {
      return JSON.parse(newMessage.body);
    }));
  }

  getNewGroupChange(groupName: string): Observable<GroupChange> {
    return this.webSocketProxyService.watch('/group/' + groupName + '/change').pipe(map(change => {
      return JSON.parse(change.body);
    }));
  }

  getNewGroupMember(groupName: string): Observable<User> {
    return this.webSocketProxyService.watch('/group/' + groupName + '/group-members').pipe(map(newMemberJson => {

      let newMember = JSON.parse(newMemberJson.body);
      let groupUsers: Array<User> = JSON.parse(window.sessionStorage.getItem(this.createParameterizedKey(this.GROUP_USERS_KEY, groupName)));
      groupUsers.push(newMember);
      sessionStorage.setItem(this.createParameterizedKey(this.GROUP_USERS_KEY, groupName), JSON.stringify(groupUsers));
      console.log(newMember);
      return newMember;
    }));
  }

  getNewGroup(): Observable<Group> {
    return this.webSocketProxyService.watch('/group/' + this.user.username + '/new-group').pipe(map(newGroupJson => {
      let newGroup = JSON.parse(newGroupJson.body);
      let groups: Array<Group> = JSON.parse(window.sessionStorage.getItem(this.GROUPS_KEY));
      groups.push(newGroup);
      sessionStorage.setItem(this.GROUPS_KEY, JSON.stringify(groups));
      return newGroup;
    }));
  }

  emptyCache(groupName: string) {
    sessionStorage.removeItem(this.GROUPS_KEY);
    sessionStorage.removeItem(this.createParameterizedKey(this.GROUP_USERS_KEY, groupName));
  }

  private createParameterizedKey(keyValue: string, parameterValue: string): string {
    return keyValue + '_' + parameterValue;
  }


  private getNotAcceptedGroupInvitations(): Observable<Array<GroupInvatation>> {
    return this.http.post<any>(`${SERVER_URL}/not-accepted-group-invitations`, {}).pipe(map(response => {
      return response;
    }));

  }

  public acceptGroupInvitation(groupInvitation: GroupInvatation) {
    this.http.post<any>(`${SERVER_URL}/accept-invitation`, groupInvitation).pipe(map(pomodoro => {
      return pomodoro;
    })).subscribe(result => {
      if (!isUndefined(result.success)) {
        this.invitations = this.invitations.filter(invitation => {
          return invitation.id !== groupInvitation.id;
        });
        sessionStorage.removeItem(this.GROUPS_KEY);
        groupInvitation.group.layoutImagePath = this.getLayoutImagePath(Math.floor(Math.random() * 5) + 1);
        this.participatingGroups.push(groupInvitation.group);
      }
    });

  }
}
