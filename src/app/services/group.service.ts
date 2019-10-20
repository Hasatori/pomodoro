import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Group} from '../model/group/group';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user/user';
import {Pomodoro} from '../model/pomodoro/pomodoro';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {
  }


  public getGroups(): Observable<Array<Group>> {
    return this.http.post<any>(`http://localhost:8080/groups`, '').pipe(map(groups => {
      return groups;
    }));
  }

  public getUsersForGroup(groupName:String): Observable<Array<User>> {
    return this.http.post<any>(`http://localhost:8080/groups/`+groupName, '').pipe(map(users => {
      return users;
    }));
  }

  public getLastPomodoroForUser(userName:String): Observable<Pomodoro> {
    return this.http.post<any>(`http://localhost:8080/groups/update/`+userName, '').pipe(map(pomodoro => {
      return pomodoro;
    }));
  }

  createGroup(name: string, isPublic: boolean): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/group/create`, {
      name: name,
      isPublic: isPublic
    }).pipe(map(response => {
      return response;
    }));
  }
}
