import {Routes} from '@angular/router';
import {PersonalInformationComponent} from './personal-information/personal-information.component';
import {PomodoroHistoryComponent} from './pomodoro-history/pomodoro-history.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {AuthGuard} from '../../guards/auth-guard.service';

export const myAccountRoutes: Routes = [
  {path: 'personal-information', component: PersonalInformationComponent, canActivate: [AuthGuard]},
  {path: 'pomodoro-history', component: PomodoroHistoryComponent, canActivate: [AuthGuard]},
  {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},];
