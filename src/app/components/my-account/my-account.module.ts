import {Routes} from '@angular/router';
import {PersonalInformationComponent} from './personal-information/personal-information.component';
import {PomodoroHistoryComponent} from './pomodoro-history/pomodoro-history.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {AuthGuard} from '../../guards/auth-guard.service';
import {SettingsComponent} from './settings/settings.component';
import {OverviewComponent} from "../group/overview/overview.component";

export const myAccountRoutes: Routes = [
  {path:'',component: PersonalInformationComponent, canActivate: [AuthGuard]},
  {path: 'personal-information', component: PersonalInformationComponent, canActivate: [AuthGuard]},
  {path: 'pomodoro-history', component: PomodoroHistoryComponent, canActivate: [AuthGuard]},
  {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},];


/*

{path: '', children: [
  { path: '',component: OverviewComponent, canActivate: [AuthGuard]},
  { path: 'overview',redirectTo:'',component: OverviewComponent, canActivate: [AuthGuard]},
]}
*/
