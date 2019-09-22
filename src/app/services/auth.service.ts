import {Injectable} from '@angular/core';
import {logger} from 'codelyzer/util/logger';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean;

  constructor() {
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public logIn(username: string, password: string): void {
    if (username === 'test' && password === 'test') {
      this.loggedIn = true;
    }
    this.loggedIn = false;
  }
}
