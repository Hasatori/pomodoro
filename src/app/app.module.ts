import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {MDBBootstrapModule, MdbBtnDirective} from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RegisterComponent} from './components/register/register.component';
import {ForgottenPasswordComponent} from './components/forgotten-password/forgotten-password.component';
import {MyAccountComponent} from './components/my-account/my-account.component';
import {SettingsComponent} from './components/my-account/settings/settings.component';
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
import {PomodoroIsRunningComponent} from './components/modals/pomodoro-is-running/pomodoro-is-running.component';
import {LoggerModule, NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {FreeTrialComponent} from './components/free-trial/free-trial.component';
import {AuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {provideConfig} from './ServerConfig';
import {WantMoreFunctionalityComponent} from './components/modals/want-more-functionality/want-more-functionality.component';
import {SuccessComponent} from './components/modals/success/success.component';
import {ChatComponent} from './components/group/group-detail/chat/chat.component';
import { LightBoxModule, CarouselModule, ModalModule, WavesModule } from 'ng-uikit-pro-standard'
import {
  AccordionModule,
  AnimatedCardsModule,
  AutoCompleterModule,
  AutoFormatModule,
  CharCounterModule,
  ChartSimpleModule, ChipsModule,
  DatepickerModule,
  FileInputModule,
 MDBBootstrapModulePro,
  MDBBootstrapModulesPro,
  MDBSpinningPreloader,
  PreloadersModule,
  RangeModule,
  SelectModule,
  SidenavModule,
  SmoothscrollModule, TableModule,
  TabsModule, TimePickerModule,
  ToastModule
} from 'ng-uikit-pro-standard';
import {OverviewComponent} from './components/group/overview/overview.component';
// MDB Angular Pro
import {ScrollSpyModule, ButtonsModule, CardsModule} from 'ng-uikit-pro-standard';
import {BackToTopComponent} from './components/back-to-top/back-to-top.component';
import {SortPipe} from './pipes/sort.pipe';
import {AcceptCookiesComponent} from './components/modals/accept-cookies/accept-cookies.component';
import {UserCardComponent} from './components/group/group-detail/members/user-card/user-card.component';
import {MembersComponent} from './components/group/group-detail/members/members.component';
import {ToDoListComponent} from './components/group/group-detail/to-do-list/to-do-list.component';
import {ChangeLogComponent} from './components/group/group-detail/change-log/change-log.component';
import {CreateEditTodoComponent} from './components/group/group-detail/to-do-list/create-edit-todo/create-edit-todo.component';
import {DatePipe} from '@angular/common';
import {EditGroupComponent} from './components/group/edit-group/edit-group.component';
import { AreYouSureComponent } from './components/modals/are-you-sure/are-you-sure.component';
import {InviteUserComponent} from './components/group/group-detail/invite-user/invite-user.component';
import { UserFilterPipe } from './pipes/UserFilter.pipe';
import { UserTodoComponent } from './components/pomodoro/user-todo/user-todo.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { GroupFilterPipe } from './pipes/group-filter.pipe';
import { InvitationFilterPipe } from './pipes/invitation-filter.pipe';
import { UserTodosFilterPipe } from './pipes/user-todos-filter.pipe';
import { TodoFilterPipe } from './pipes/todo-filter.pipe';



const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'free-trial', component: FreeTrialComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgotten-password', component: ForgottenPasswordComponent},
  {path: 'pomodoro', component: PomodoroComponent, canActivate: [AuthGuard]},
  {path: 'group', component: GroupComponent, canActivate: [AuthGuard], children: groupDetailRoutes},
  {path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard]},
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
    PomodoroIsRunningComponent,
    FreeTrialComponent,
    WantMoreFunctionalityComponent,
    SuccessComponent,
    ChatComponent,
    OverviewComponent,
    BackToTopComponent,
    SortPipe,
    AcceptCookiesComponent,
    UserCardComponent,
    MembersComponent,
    ToDoListComponent,
    ChangeLogComponent,
    CreateEditTodoComponent,
    AreYouSureComponent,
    InviteUserComponent,
    UserFilterPipe,
    EditGroupComponent,
    UserTodoComponent,
    GroupFilterPipe,
    InvitationFilterPipe,
    UserTodosFilterPipe,
    TodoFilterPipe


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    HttpClientModule,
    CountdownModule,
    LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}),
    SocialLoginModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    ButtonsModule,
    WavesModule,
    CardsModule,
    AccordionModule,
    ToastModule.forRoot(),
    AutoCompleterModule,
    AutoFormatModule,
    AnimatedCardsModule.forRoot(),
    CardsModule.forRoot(),
    DatepickerModule,
    ChartSimpleModule,
    FileInputModule,
    CharCounterModule.forRoot(),
    LightBoxModule,
    SelectModule,
    PreloadersModule,
    RangeModule,
    ScrollSpyModule,
    SidenavModule,
    SmoothscrollModule.forRoot(),
    TabsModule.forRoot(),
    ChipsModule,
    TimePickerModule,
    TableModule,
    CardsModule,
    ModalModule,
    NgxPaginationModule


  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}, {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
  }, RxStompService,
    {
      provide: StompConfig,
      useValue: webSocketConfig
    },
    AuthService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    MDBSpinningPreloader,
    DatePipe,
    UserFilterPipe
  ]
  ,
  bootstrap: [AppComponent]
})


export class AppModule {
}
