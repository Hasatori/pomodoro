import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RegisterComponent} from './components/register/register.component';
import {ForgottenPasswordComponent} from './components/forgotten-password/forgotten-password.component';
import {MyAccountComponent} from './components/my-account/my-account.component';
import {SettingsComponent} from './components/settings/settings.component';
import {AuthGuard} from './guards/auth-guard.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './services/jwt-interceptor';
import {ErrorInterceptor} from './services/error-interceptor';
import {FooterComponent} from './components/footer/footer.component';
import {PersonalInformationComponent} from './components/my-account/personal-information/personal-information.component';
import {PomodoroHistoryComponent} from './components/my-account/pomodoro-history/pomodoro-history.component';
import {ChangePasswordComponent} from './components/my-account/change-password/change-password.component';
import {myAccountRoutes} from './components/my-account/my-account.module';
import {PomodoroComponent} from './components/pomodoro/pomodoro.component';
import {CountdownModule} from 'ngx-countdown';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory, StompConfig, StompService} from '@stomp/ng2-stompjs';
import {webSocketConfig} from './WebSocketConfig';
import {GroupComponent} from './components/group/group.component';
import {GroupDetailComponent} from './components/group/group-detail/group-detail.component';
import {groupDetailRoutes} from './components/group/group.module';
import {CreateGroupComponent} from './components/group/create-group/create-group.component';
import {AuthService} from './services/auth.service';
import { PomodoroIsRunningComponent } from './components/modals/pomodoro-is-running/pomodoro-is-running.component';


const routes: Routes = [
  {path: '', redirectTo: 'pomodoro', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'pomodoro', component: PomodoroComponent, canActivate: [AuthGuard]},
  {path: 'group', component: GroupComponent, canActivate: [AuthGuard], children: groupDetailRoutes},
  {path: 'my-account', redirectTo: 'my-account/personal-information', canActivate: [AuthGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard], children: myAccountRoutes},

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    RegisterComponent,
    ForgottenPasswordComponent,
    MyAccountComponent,
    SettingsComponent,
    FooterComponent,
    PersonalInformationComponent,
    PomodoroHistoryComponent,
    ChangePasswordComponent,
    PomodoroComponent,
    GroupComponent,
    GroupDetailComponent,
    CreateGroupComponent,
    PomodoroIsRunningComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    HttpClientModule,
    CountdownModule


  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}, {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }, RxStompService,
    {
      provide: StompConfig,
      useValue: webSocketConfig
    },
  AuthService,],
  bootstrap: [AppComponent]
})


export class AppModule {
}
