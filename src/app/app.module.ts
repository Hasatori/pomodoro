import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {NavbarComponent} from './navbar/navbar.component';
import {RegisterComponent} from './register/register.component';
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    RegisterComponent,
    ForgottenPasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule {
}
