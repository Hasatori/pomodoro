import {Routes} from '@angular/router';
import {AuthGuard} from '../../guards/auth-guard.service';
import {GroupDetailComponent} from './group-detail/group-detail.component';
import {CreateGroupComponent} from './create-group/create-group.component';
import {OverviewComponent} from './overview/overview.component';

export const groupDetailRoutes: Routes = [
  {path: 'overview/:name', component: GroupDetailComponent, canActivate: [AuthGuard]},
  {path: 'create', component: CreateGroupComponent, canActivate: [AuthGuard]},
  {path: '', children: [
      { path: '',component: OverviewComponent, canActivate: [AuthGuard]},
      { path: 'overview',redirectTo:'',component: OverviewComponent, canActivate: [AuthGuard]},
    ]}
];
