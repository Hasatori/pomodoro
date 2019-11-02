import {Injectable} from '@angular/core';
import {logger} from 'codelyzer/util/logger';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {User} from '../model/user';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import * as bcrypt from 'bcryptjs';
import {error} from 'selenium-webdriver';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: string;

  constructor(private http: HttpClient, private router: Router) {
    this.accessToken = localStorage.getItem('accessToken');

  }

  public get currentAccessTokenValue(): string {
    return this.accessToken;
  }

  login(userName: string, password: string) {
    console.log('test');
    return this.http.post<any>(`http://localhost:8080/authenticate`, {username: userName, password})
      .pipe(map(accessToken => {
        console.log(accessToken);
        if (accessToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('accessToken', accessToken.token);
          this.accessToken = localStorage.getItem('accessToken');
        }
        return accessToken;
      }));
  }

  logout() {
    console.log('Logging out');
    localStorage.removeItem('accessToken');
    this.accessToken = '';
    this.router.navigate(['/login']);
  }


}
