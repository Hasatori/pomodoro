import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

import {stringify} from 'querystring';
import {environment} from '../../environments/environment';
import {getEnvironment} from "../ServerConfig";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
    return this.http.post<any>(`${getEnvironment().backend}authenticate`, {username: userName, password})
      .pipe(map(response => {
        this.serverLoginResponseCame(response);
      }));
  }

  logout() {
    console.log('Logging out');
    sessionStorage.clear();
    this.accessToken = '';
    this.router.navigate(['login']);
  }

  isLoggedIn() {
    if (sessionStorage.getItem(this.ACCESS_TOKEN_KEY) !== null) {
      return true;
    }
  }

  loginWithFB(facebookResponse: any): Observable<any> {
    return this.http.post<any>(`${getEnvironment().backend}facebookLogin`, facebookResponse)
      .pipe(map(response => {
        this.serverLoginResponseCame(response);
      }));
  }

  private serverLoginResponseCame(response: any) {
    if (response) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      console.log(response);
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, response.jwttoken);
      this.accessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return response;
  }
  public updateToken(newToken:string){
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, newToken);
    this.accessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
}
