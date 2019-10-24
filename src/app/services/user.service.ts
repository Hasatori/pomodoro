import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from '../redux/user/user';
import {Observable} from 'rxjs';
import {Pomodoro} from '../redux/pomodoro/pomodoro';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUser(): Observable<User> {
    return this.http.post<any>(`http://localhost:8080/userDetails`, '').pipe(map(user => {
      return user;
    }));
  }

  updateUser(user: User): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/updateDetails`, user).pipe(map(user => {
      return user;
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
    return this.http.post<any>(`http://localhost:8080/userPomodoros`, '').pipe(map(pomodoros => {
      return pomodoros;
    }));
  }
}
