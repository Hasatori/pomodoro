import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from '../services/login.service';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const loggdIn = this.loginService.isLoggedIn();
    if (!loggdIn) {
      return this.router.parseUrl('/login');
    }
    return loggdIn;
  }


}
