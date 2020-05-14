import {Injectable} from '@angular/core';
import {map, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user/user';
import {Observable, of} from 'rxjs';
import {Pomodoro} from '../model/user/pomodoro';
import {Settings} from '../model/user/settings';
import {WebSocketProxyService} from './web-socket-proxy.service';
import {getEnvironment} from "../server-config";
import {UserToDo} from "../model/to-do/user-to-do";
import {GroupToDo} from "../model/to-do/group-to-do";
import {Message} from "../model/message/message";
import {DirectMessage} from "../model/message/direct-message";
import {AuthService} from "./auth.service";
import {IsUserTyping} from "../model/message/is-user-typing";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USER_KEY: string = 'currentUser';
  private POMODOROS_KEY: string = 'pomodoros';
  private USER_TODOS_KEY: string = 'userTodos';
  private USER_GROUP_TODOS_KEY: string = 'userGroupTodos';

  public allUnreadMessages: number = 0;
  public userUnreadMessages: Map<string, number> = new Map<string, number>();

  constructor(private http: HttpClient, private webSocketProxyService: WebSocketProxyService, private authenticationService: AuthService) {
  }

  startSockets() {
    this.getUser().subscribe(user => {
      this.getAllMyDirectUnreadMessages(user).subscribe(unreadDirectMessages => {
        this.allUnreadMessages += unreadDirectMessages.length;
        unreadDirectMessages.forEach((uND) => {
          this.userUnreadMessages.set(uND.author.username, this.userUnreadMessages.get(uND.author.username) + 1);
        });
      });
      this.getDirectMessage().subscribe((uND) => {
        this.allUnreadMessages++;
        this.userUnreadMessages.set(uND.author.username, this.userUnreadMessages.get(uND.author.username) + 1);
      })
    });
  }

  getDirectMessageFromUser(user: User): Observable<DirectMessage> {
    return this.getDirectMessage().pipe(map(value => {
      let directMessage: DirectMessage = value as DirectMessage;
      if (user.username == directMessage.author.username || user.username == directMessage.recipient.username) {
        return directMessage;
      }
    }));
  }

  getResendDirectMessageFromUser(user: User): Observable<DirectMessage> {
    return this.getResendDirectMessage().pipe(map(value => {
      let directMessage: DirectMessage = value as DirectMessage;
      if (user.username == directMessage.author.username || user.username == directMessage.recipient.username) {
        return directMessage;
      }
    }));
  }

  getIsUserTyping(user: User): Observable<boolean> {
    return this.getAllTypingUsers().pipe(map(value => {
      console.log(value);
      let isUserTyping: IsUserTyping = value as IsUserTyping;
      if (user.username == isUserTyping.user.username) {
        return isUserTyping.isTyping;
      }
    }));
  }

  getDirectMessage(): Observable<DirectMessage> {
    return this.webSocketProxyService.watch('/user/' + this.authenticationService.currentAccessTokenValue + '/chat').pipe(map(newMessage => {
      return JSON.parse(newMessage.body);
    }));
  }

  getResendDirectMessage(): Observable<DirectMessage> {
    return this.webSocketProxyService.watch('/user/' + this.authenticationService.currentAccessTokenValue + '/chat/resend').pipe(map(newMessage => {
      return JSON.parse(newMessage.body);
    }));
  }

  getAllTypingUsers(): Observable<IsUserTyping> {
    return this.webSocketProxyService.watch('/user/' + this.authenticationService.currentAccessTokenValue + '/chat/typing').pipe(map(isUserTyping => {
      return JSON.parse(isUserTyping.body);
    }));
  }

  public getLastNumberOfDirectMessages(user: User, start: number, stop: number): Observable<Array<DirectMessage>> {
    return this.http.post<any>(`${getEnvironment().backend}fetch-chat-messages`, {
      name: user.username,
      start: start,
      stop: stop
    }).pipe(map(response => {
      return response;

    }));

  }

  private getAllMyDirectUnreadMessages(user: User): Observable<Array<DirectMessage>> {
    return this.http.get<any>(`${getEnvironment().backend}fetch-unread-messages`).pipe(map(response => {
      return response;
    }));
  }


  getUser(): Observable<User> {
    let user: User = JSON.parse(window.sessionStorage.getItem(this.USER_KEY));
    if (user != null) {
      return of(user);
    } else {
      return this.http.post<any>(`${getEnvironment().backend}userDetails`, '').pipe(map(user => {
        window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
        return user;
      }));
    }
  }

  updateUser(updatedUser: User): Observable<any> {
    return this.http.post<any>(`${getEnvironment().backend}updateDetails`, updatedUser).pipe(map(response => {
      window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      return response;
    }));
  }

  updateSettings(updatedSettings: Settings): Observable<any> {
    return this.http.post<any>(`${getEnvironment().backend}updateSettings`, updatedSettings).pipe(map(response => {
      this.getUser().subscribe(user => {
        user.settings = updatedSettings;
        window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      });

      return response;
    }));
  }

  changePassword(oldPasswword: string, newPassword: string) {
    return this.http.post<any>(`${getEnvironment().backend}changePassword`, {
      oldPassword: oldPasswword,
      newPassword: newPassword
    }).pipe(map(response => {
      return response;
    }));
  }

  sendMessage(value: String, user: User) {
    this.webSocketProxyService.publish('/app/user/' + user.username + '/chat', value);
  }


  editMessage(directMessage: DirectMessage, user: User) {
    this.webSocketProxyService.publish('/app/user/' + user.username + '/chat/react', JSON.stringify(directMessage.currentUserReaction));
  }

  reportTypingToUser(amITyping: boolean, userToReport: User) {
    console.log(amITyping);
    this.webSocketProxyService.publish('/app/user/' + userToReport.username + '/chat/typing',JSON.stringify(amITyping));
  }

  userPomodoros(): Observable<Array<Pomodoro>> {
    let pomodoros: Array<Pomodoro> = JSON.parse(window.sessionStorage.getItem(this.POMODOROS_KEY));
    if (pomodoros != null) {
      return of(pomodoros);
    } else {
      return this.http.post<any>(`${getEnvironment().backend}userPomodoros`, '').pipe(map(pomodoros => {
        window.sessionStorage.setItem(this.POMODOROS_KEY, JSON.stringify(pomodoros));
        return pomodoros;
      }));
    }
  }

  userTodos(): Observable<Array<UserToDo>> {
    let todos: Array<UserToDo> = JSON.parse(window.sessionStorage.getItem(this.USER_TODOS_KEY));
    if (todos != null) {
      return of(todos);
    } else {
      return this.http.post<any>(`${getEnvironment().backend}userTodos`, '').pipe(map(todos => {
        window.sessionStorage.setItem(this.USER_TODOS_KEY, JSON.stringify(todos));
        return todos;
      }));
    }
  }

  groupTodos(): Observable<Array<GroupToDo>> {
    let todos: Array<GroupToDo> = JSON.parse(window.sessionStorage.getItem(this.USER_GROUP_TODOS_KEY));
    if (todos != null) {
      return of(todos);
    } else {
      return this.http.post<any>(`${getEnvironment().backend}groupTodos`, '').pipe(map(todos => {
        window.sessionStorage.setItem(this.USER_GROUP_TODOS_KEY, JSON.stringify(todos));
        return todos;
      }));
    }
  }

  public getGroupToDos(groupName: string): Observable<Array<GroupToDo>> {
    return this.http.post<any>(`${getEnvironment().backend}groups/${groupName}/fetch-todos`, {
      groupName: groupName
    }).pipe(map(response => {
      return response;
    }));

  }

  removeTodos(todos: Array<UserToDo>): Observable<any> {
    let ids = todos.map(todo => todo.id);
    return this.http.post<any>(`${getEnvironment().backend}remove-todo`, ids).pipe(map(response => {
      if (response.success !== null) {
        window.sessionStorage.removeItem(this.USER_TODOS_KEY);
      }
      return response;
    }));
  }

  updateTodo(updatedTodo: UserToDo) {
    this.getUser().subscribe(user => {
      this.webSocketProxyService.publish('/app/author/' + user.username + '/todos', JSON.stringify(updatedTodo));
      window.sessionStorage.removeItem(this.USER_TODOS_KEY);
    });
  }

  addToDo(newTodo: UserToDo) {
    this.getUser().subscribe(user => {
      this.webSocketProxyService.publish('/app/author/' + user.username + '/todos', JSON.stringify(newTodo));
      window.sessionStorage.removeItem(this.USER_TODOS_KEY);
    });
  }
}
