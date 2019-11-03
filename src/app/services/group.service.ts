import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Group} from '../model/group';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {Pomodoro} from '../model/pomodoro';
import {SERVER_URL} from '../ServerConfig';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private GROUPS_KEY:string="userGroups";
private GROUP_USERS_KEY:string="groupUsers";
  private USER_POMODORO_KEY:string="userPomodoro";
  constructor(private http: HttpClient) {
  }


  public getGroups(): Observable<Array<Group>> {
    let groups:Array<Group> = JSON.parse(window.sessionStorage.getItem(this.GROUPS_KEY));
    if (groups != null) {
      return of(groups);
    }else {
      return this.http.post<any>(`${SERVER_URL}/groups`, '').pipe(map(groups => {
        sessionStorage.setItem(this.GROUPS_KEY,JSON.stringify(groups));
        return groups;
      }));
    }
  }

  public getUsersForGroup(groupName:string): Observable<Array<User>> {
      let groupUsers:Array<User> = JSON.parse(window.sessionStorage.getItem(this.createParameterizedKey(this.GROUP_USERS_KEY,groupName)));
    if (groupUsers != null) {
      return of(groupUsers);
    }else {
      return this.http.post<any>(`${SERVER_URL}/groups/` + groupName, '').pipe(map(users => {
        sessionStorage.setItem(this.createParameterizedKey(this.GROUP_USERS_KEY,groupName),JSON.stringify(users));
        return users;
      }));
    }
  }

  public getLastPomodoroForUser(userName:string): Observable<Pomodoro> {
    // let pomodorosForUser:Pomodoro= JSON.parse(window.sessionStorage.getItem(this.createParameterizedKey(this.USER_POMODORO_KEY,userName)));
    // if (pomodorosForUser != null) {
    //   return of(pomodorosForUser);
    // }else {
      return this.http.post<any>(`${SERVER_URL}/groups/update/` + userName, '').pipe(map(pomodoro => {
      //  sessionStorage.setItem(this.createParameterizedKey(this.USER_POMODORO_KEY,userName),JSON.stringify(pomodoro));
        return pomodoro;
      }));
   // }
  }

  createGroup(name: string, isPublic: boolean): Observable<any> {
    return this.http.post<any>(`${SERVER_URL}/group/create`, {
      name: name,
      isPublic: isPublic
    }).pipe(map(response => {
      return response;
    }));
  }

  private createParameterizedKey(keyValue:string,parameterValue:string):string{
    return keyValue+'_'+parameterValue;
  }
}
