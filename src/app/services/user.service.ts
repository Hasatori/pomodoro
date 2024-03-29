import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {Observable, of} from 'rxjs';
import {Pomodoro} from '../model/pomodoro';
import {Settings} from '../model/settings';
import {GroupInvitation} from '../model/group-invitation';

import {UserTodo} from '../model/user-todo';
import {GroupToDo} from '../model/GroupToDo';
import {Group} from '../model/group';
import {ChangeType} from '../model/group-change';
import {WebSocketProxyService} from './web-socket-proxy.service';
import {environment} from '../../environments/environment';
import {getEnvironment} from "../ServerConfig";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USER_KEY: string = 'currentUser';
  private POMODOROS_KEY: string = 'pomodoros';
  private USER_TODOS_KEY: string = 'userTodos';
  private USER_GROUP_TODOS_KEY: string = 'userGroupTodos';

  constructor(private http: HttpClient, private webSocketProxyService: WebSocketProxyService) {
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

  userTodos(): Observable<Array<UserTodo>> {
    let todos: Array<UserTodo> = JSON.parse(window.sessionStorage.getItem(this.USER_TODOS_KEY));
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

  removeTodos(todos: Array<UserTodo>): Observable<any> {
    let ids = todos.map(todo => todo.id);
    return this.http.post<any>(`${getEnvironment().backend}remove-todo`, ids).pipe(map(response => {
      if (response.success!==null){
        window.sessionStorage.removeItem(this.USER_TODOS_KEY);
      }
      return response;
    }));
  }

  updateTodo(updatedTodo: UserTodo) {
    this.getUser().subscribe(user => {
      this.webSocketProxyService.publish('/app/user/' + user.username + '/todos', JSON.stringify(updatedTodo));
      window.sessionStorage.removeItem(this.USER_TODOS_KEY);
    });
  }

  addToDo(newTodo: UserTodo) {
    this.getUser().subscribe(user => {
      this.webSocketProxyService.publish('/app/user/' + user.username + '/todos', JSON.stringify(newTodo));
      window.sessionStorage.removeItem(this.USER_TODOS_KEY);
    });
  }
}
