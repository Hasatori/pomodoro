import {Injectable, OnDestroy} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {Group} from '../model/group';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {Pomodoro} from '../model/pomodoro';
import {GroupMessage} from '../model/group-message';
import {WebSocketProxyService} from './web-socket-proxy.service';
import {UserService} from './user.service';
import {GroupInvitation} from '../model/group-invitation';
import {isUndefined} from 'util';
import {ChangeType, GroupChange} from '../model/group-change';
import {GroupToDo} from '../model/GroupToDo';
import {environment} from '../../environments/environment';
import {getEnvironment} from "../ServerConfig";

@Injectable({
  providedIn: 'root'
})
export class GroupService implements OnDestroy {

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
  public invitations: Array<GroupInvitation> = [];

  public groups: Array<Group> = [];
  public ownedGroups: Array<Group> = [];
  public participatingGroups: Array<Group> = [];

  private subscriptions: Array<Subscription> = [];

  public chatMuted: boolean = false;

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
      this.groups = groups.sort(function(a, b) {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      });
      this.userService.getUser().subscribe(user => {
        this.user = user;
        let count = 1;
        for (let group of groups) {
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
          this.ownedGroups.unshift(newGroup);
        } else {
          this.participatingGroups.unshift(newGroup);
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
            if (!this.chatMuted) {
              this.audio.play();
            }
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
    return this.http.post<any>(`${getEnvironment().backend}groups/${groupName}/fetch-unread-messages`, {
      groupName: groupName,
    }).pipe(map(response => {
      return response;
    }));
  }

  markAllFromGroupAsRead(groupName: string): Observable<GroupMessage> {
    this.allUnreadMessages -= this.groupUnreadMessages.get(groupName);
    this.groupUnreadMessages.set(groupName, 0);
    return this.http.post<any>(`${getEnvironment().backend}groups/${groupName}/mark-all-as-read`, {}).pipe(map(response => {
      return response;
    }));
  }

  public getGroups(): Observable<Array<Group>> {
    let groups: Array<Group> = JSON.parse(window.sessionStorage.getItem(this.GROUPS_KEY));
    if (groups != null) {
      return of(groups);
    } else {
      return this.http.post<any>(`${getEnvironment().backend}groups`, '').pipe(map(groups => {
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
      return this.http.post<any>(`${getEnvironment().backend}groups/` + groupName, '').pipe(map(users => {
        sessionStorage.setItem(this.createParameterizedKey(this.GROUP_USERS_KEY, groupName), JSON.stringify(users));
        return users;
      }));
    }
  }

  public getLastPomodoroForUser(userName: string): Observable<Pomodoro> {
    return this.http.post<any>(`${getEnvironment().backend}groups/update/` + userName, '').pipe(map(pomodoro => {
      return pomodoro;
    }));

  }

  public getLastNumberOfGroupMessages(groupName: string, start: number, stop: number): Observable<Array<GroupMessage>> {
    return this.http.post<any>(`${getEnvironment().backend}groups/${groupName}/fetch-chat-messages`, {
      groupName: groupName,
      start: start,
      stop: stop
    }).pipe(map(response => {
      return response;
    }));

  }

  public getLastNumberOfGroupChanges(groupName: string, start: number, stop: number): Observable<Array<GroupChange>> {
    return this.http.post<any>(`${getEnvironment().backend}groups/${groupName}/fetch-changes`, {
      groupName: groupName,
      start: start,
      stop: stop
    }).pipe(map(response => {
      return response;
    }));

  }

  public getGroupToDos(groupName: string): Observable<Array<GroupToDo>> {
    return this.http.post<any>(`${getEnvironment().backend}groups/${groupName}/fetch-todos`, {
      groupName: groupName
    }).pipe(map(response => {

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

  createGroup(name: string, isPublic: boolean, groupDescription: string, layoutImage: string): Observable<any> {
    let group = new Group();
    group.name = name;
    group.isPublic = isPublic;
    group.layoutImage = layoutImage;
    group.description = groupDescription;
    group.created=new Date(Date.now());
    return this.http.post<any>(`${getEnvironment().backend}group/create`, group
    ).pipe(map(response => {
      sessionStorage.removeItem(this.GROUPS_KEY);
      this.startSockets();
      return response;
    }));
  }

  addUser(username: string, groupName: string) {

    this.sendChange(groupName, ChangeType.CREATE, `${username} has been invited `);
  }

  private sendChange(groupName: string, changeType: ChangeType, changeDescription: string) {
    let change = new GroupChange();
    change.changeDescription = changeDescription;
    change.changeType = changeType;
    this.webSocketProxyService.publish('/app/group/' + groupName + '/change', JSON.stringify(change));
  }

  removeUser(username: string, groupName: string): Observable<any> {
    return this.http.post<any>(`${getEnvironment().backend}group/removeUser`, {
      username: username, groupName: groupName
    }).pipe(map(response => {
      this.sendChange(groupName, ChangeType.DELETE, `${username} has been removed`);
      return response;
    }));

  }

  getNewGroupMessage(groupName: string): Observable<GroupMessage> {
    return this.webSocketProxyService.watch('/group/' + groupName + '/chat').pipe(map(newMessage => {
      return JSON.parse(newMessage.body);
    }));
  }
  getResendGroupMessage(groupName: string): Observable<GroupMessage> {
    return this.webSocketProxyService.watch('/group/' + groupName + '/chat/resend').pipe(map(newMessage => {
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


  private getNotAcceptedGroupInvitations(): Observable<Array<GroupInvitation>> {
    return this.http.post<any>(`${getEnvironment().backend}not-accepted-group-invitations`, {}).pipe(map(response => {

      return response;
    }));

  }

  public acceptGroupInvitation(groupInvitation: GroupInvitation) {
    this.http.post<any>(`${getEnvironment().backend}accept-invitation`, groupInvitation).pipe(map(pomodoro => {
      return pomodoro;
    })).subscribe(result => {
      if (!isUndefined(result.success)) {
        let index = this.invitations.indexOf(groupInvitation, 0);
        if (index > -1) {
          this.invitations.splice(index, 1);
        }
        sessionStorage.removeItem(this.GROUPS_KEY);
        this.participatingGroups.push(groupInvitation.group);
      }
    });
  }

  updateTodo(group: Group, oldToDo: GroupToDo, updatedTodo: GroupToDo) {
    let changeMessage = `To do ${oldToDo.description}has been updated\nChanges:\n`;
    if (oldToDo.description !== updatedTodo.description) {
      changeMessage = changeMessage + `Name change to ${updatedTodo.description}\n`;
    }
    if (new Date(oldToDo.deadline).getTime() !== new Date(updatedTodo.deadline).getTime()) {
      changeMessage = changeMessage + `Deadline change to ${updatedTodo.deadline}\n`;
    }
    let newMembers = updatedTodo.assignedUsers.filter(updatedTodoMember => !oldToDo.assignedUsers.some(oldTodoMember => oldTodoMember.id === updatedTodoMember.id)).map(member => member.username);
    let removedMembers = oldToDo.assignedUsers.filter(oldTodoMember => !updatedTodo.assignedUsers.some(updatedTodoMember => oldTodoMember.id === updatedTodoMember.id)).map(member => member.username);

    if (newMembers.length > 0) {
      changeMessage = changeMessage + `These members were assigned: ${newMembers}\n`;
    }
    if (removedMembers.length > 0) {
      changeMessage = changeMessage + `These members were unassigned: ${removedMembers}\n`;
    }
    this.sendChange(group.name, ChangeType.UPDATE, changeMessage);
    this.webSocketProxyService.publish('/app/group/' + group.name + '/todos', JSON.stringify(updatedTodo));

  }

  addToDo(group: Group, newTodo: GroupToDo) {
    this.sendChange(group.name, ChangeType.CREATE, `To do ${newTodo.description} has been added`);
    this.webSocketProxyService.publish('/app/group/' + group.name + '/todos', JSON.stringify(newTodo));

  }

  removeGroupTodos(group: Group, todos: Array<GroupToDo>): Observable<any> {

    let ids = todos.map(todo => todo.id);

    return this.http.post<any>(`${getEnvironment().backend}group/remove-todo`, ids).pipe(map(response => {
      todos.forEach(todo => {
        this.sendChange(group.name, ChangeType.DELETE, `Todo ${todo.description} has been deleted`);
      });
      return response;
    }));
  }

  getInvitationsForGroup(group: Group): Observable<Array<GroupInvitation>> {
    return this.http.post<any>(`${getEnvironment().backend}group/${group.name}/invitations`, group
    ).pipe(map(response => {
      return response;
    }));

  }

  invitedUserToGroup(user: User, group: Group): Observable<any> {
    return this.http.post<any>(`${getEnvironment().backend}group/${group.name}/invite-user`, {
      invitedUser: user,
      group: group
    }).pipe(map(response => {
      this.sendChange(group.name, ChangeType.UPDATE, `User ${user.username} was invited to the group`);
      return response;
    }));

  }

  ngOnDestroy(): void {
  }


}
