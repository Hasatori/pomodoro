import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private loginService: AuthService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const loggdIn = this.loginService.isLoggedIn();
    if (!loggdIn) {
      return this.router.parseUrl('/login');
    }
    return loggdIn;
  }


}
