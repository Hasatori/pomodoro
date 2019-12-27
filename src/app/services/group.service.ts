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
  public numberOfNotAcceptedGroupInvitations: number = 0;

  constructor(private http: HttpClient, private webSocketProxyService: WebSocketProxyService, private userService: UserService) {
  }

  startListeningForChats() {
    this.audio = document.createElement('audio');
    this.audio.setAttribute('src', this.SOUNDS_PATH + this.messageCameSoundName);
    this.userService.getUser().subscribe((user) => {
      this.user = user;

    });
    this.getGroups().subscribe((groups) => {
      for (let group of groups) {
        this.groupUnreadMessages.set(group.name, 0);
        this.getAllUnreadMessagesForGroup(group.name).subscribe(messages => {
          let numberToSet = messages.length;
          if (isNaN(numberToSet)) {
            numberToSet = 0;
          }
          this.groupUnreadMessages.set(group.name, numberToSet);
          this.allUnreadMessages += numberToSet;
        });
        this.getNewGroupMessage(group.name).subscribe(message => {
          if (message.author.username !== this.user.username) {
            this.audio.play();
            this.allUnreadMessages++;
            this.groupUnreadMessages.set(group.name, this.groupUnreadMessages.get(group.name) + 1);
          }
        });
      }
    });
    this.getNotAcceptedGroupInvitations().subscribe(groupInvitations => {
      this.numberOfNotAcceptedGroupInvitations = groupInvitations.length;
    });
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

  createGroup(name: string, isPublic: boolean): Observable<any> {
    return this.http.post<any>(`${SERVER_URL}/group/create`, {
      name: name,
      isPublic: isPublic
    }).pipe(map(response => {
      sessionStorage.setItem(this.GROUPS_KEY, JSON.stringify(null));
      return response;
    }));
  }


  addUser(username: string, groupName: string): Observable<any> {
    return this.http.post<any>(`${SERVER_URL}/group/addUser`, {username: username, groupName: groupName}).pipe(map(response => {
      return response;
    }));
  }

  removeUser(username: string, groupName: string): Observable<any> {
    return this.http.post<any>(`${SERVER_URL}/group/removeUser`, {
      username: username, groupName: groupName
    }).pipe(map(response => {
      return response;
    }));
  }

  getNewGroupMessage(groupName: string): Observable<GroupMessage> {
    return this.webSocketProxyService.watch('/group/' + groupName + '/chat').pipe(map(newMessage => {
      return JSON.parse(newMessage.body);
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
}
