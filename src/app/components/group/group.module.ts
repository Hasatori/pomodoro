import {Routes} from '@angular/router';
import {AuthGuard} from '../../guards/auth-guard.service';
import {GroupDetailComponent} from './group-detail/group-detail.component';

export const groupDetailRoutes: Routes = [
  {path: ':name', component: GroupDetailComponent, canActivate: [AuthGuard]},];
