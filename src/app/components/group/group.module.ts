import {Routes} from '@angular/router';
import {AuthGuard} from '../../guards/auth-guard.service';
import {GroupDetailComponent} from './group-detail/group-detail.component';
import {OverviewComponent} from './overview/overview.component';

export const groupDetailRoutes: Routes = [
  {path: 'overview/:name', component: GroupDetailComponent, canActivate: [AuthGuard]},
  {path: '', children: [
      { path: '',component: OverviewComponent, canActivate: [AuthGuard]},
      { path: 'overview',redirectTo:'',component: OverviewComponent, canActivate: [AuthGuard]},
    ]}
];
