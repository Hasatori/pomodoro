import {Injectable} from '@angular/core';
import {logger} from 'codelyzer/util/logger';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {User} from '../model/user';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import * as bcrypt from 'bcryptjs';
import {error} from 'selenium-webdriver';
import {Router} from '@angular/router';
import {tree} from 'd3-hierarchy';
import {PomodoroService} from './pomodoro.service';
import {SERVER_URL} from '../ServerConfig';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private ACCESS_TOKEN_KEY: string = 'accessToken';
  private accessToken: string;

  constructor(private http: HttpClient, private router: Router) {
    this.accessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public get currentAccessTokenValue(): string {
    return this.accessToken;
  }

  login(userName: string, password: string) {
    console.log('test');
    return this.http.post<any>(`${SERVER_URL}/authenticate`, {username: userName, password})
      .pipe(map(accessToken => {
        console.log(accessToken);
        if (accessToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken.token);
          this.accessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
        }
        return accessToken;
      }));
  }

  logout() {
    console.log('Logging out');
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.accessToken = '';
    this.router.navigate(['login']);
  }

  isLoggedIn() {
    if (sessionStorage.getItem(this.ACCESS_TOKEN_KEY) !== null) {
      return true;
    }
  }
}
