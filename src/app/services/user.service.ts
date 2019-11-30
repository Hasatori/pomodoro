import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {Observable, of} from 'rxjs';
import {Pomodoro} from '../model/pomodoro';
import {Settings} from '../model/settings';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USER_KEY: string = 'currentUser';
  private POMODOROS_KEY:string='pomodoros';

  constructor(private http: HttpClient) {
  }

  getUser(): Observable<User> {
    let user: User = JSON.parse(window.sessionStorage.getItem(this.USER_KEY));
    if (user != null) {
      return of(user);
    }else {
    return this.http.post<any>(`http://localhost:8080/userDetails`, '').pipe(map(user => {
       window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      return user;
    }));
  }
  }
  updateUser(updatedUser: User): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/updateDetails`,updatedUser).pipe(map(response => {
      window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      return response;
    }));
  }
  updateSettings(updatedSettings: Settings): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/updateSettings`,updatedSettings).pipe(map(response => {
   this.getUser().subscribe(user=>{
        user.settings=updatedSettings;
        window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      });

      return response;
    }));
  }
  changePassword(oldPasswword: string, newPassword: string) {
    return this.http.post<any>(`http://localhost:8080/changePassword`, {
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
    }else {
    return this.http.post<any>(`http://localhost:8080/userPomodoros`, '').pipe(map(pomodoros => {
      window.sessionStorage.setItem(this.POMODOROS_KEY, JSON.stringify(pomodoros));
      return pomodoros;
    }));
    }
  }
}
