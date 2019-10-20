import {Routes} from '@angular/router';
import {AuthGuard} from '../../guards/auth-guard.service';
import {GroupDetailComponent} from './group-detail/group-detail.component';
import {CreateGroupComponent} from './create-group/create-group.component';

export const groupDetailRoutes: Routes = [
  {path: ':name', component: GroupDetailComponent, canActivate: [AuthGuard]},
  {path: 'create/group', component: CreateGroupComponent, canActivate: [AuthGuard]}
];
