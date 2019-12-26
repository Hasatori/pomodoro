import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {log} from 'util';
import {PomodoroService} from '../../services/pomodoro.service';
import {AuthService as FacebookAuth, FacebookLoginProvider} from 'angularx-social-login';
import {WebSocketProxyService} from '../../services/web-socket-proxy.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  elegantForm: FormGroup;
  logInError = false;
  loggingInProgress = false;
  elegantFormPasswordEx: AbstractControl;
  elegantFormUsernameEx: AbstractControl;

  constructor(public fb: FormBuilder, private authenticationService: AuthService, private router: Router, private pomodoroService: PomodoroService, private webSocketInitService:WebSocketProxyService, private facebookAuth: FacebookAuth) {
    this.elegantForm = fb.group({
      'elegantFormUsernameEx': ['', [Validators.required]],
      'elegantFormPasswordEx': ['', Validators.required],
    });
    this.elegantFormPasswordEx = this.elegantForm.controls['elegantFormPasswordEx'];
    this.elegantFormUsernameEx = this.elegantForm.controls['elegantFormUsernameEx'];

  }

  ngOnInit() {

  }

  signIn(username: string, password: string) {
    this.elegantFormPasswordEx.markAsTouched();
    this.elegantFormUsernameEx.markAsTouched();
    if (this.elegantForm.valid) {
      this.loggingInProgress = true;
      this.authenticationService.login(username, password).pipe(first())
        .subscribe(
          data => {
            this.loginSuccessful(data);
          },
          error => {
            this.loginUnsuccessful(error);
          });
    }
  }

  loginWithFB() {
    this.loggingInProgress = true;
    this.facebookAuth.signIn(FacebookLoginProvider.PROVIDER_ID).then(() => {
      this.facebookAuth.authState.subscribe((facebookResponse) => {
        this.authenticationService.loginWithFB(facebookResponse).pipe(first())
          .subscribe(
            data => {
              this.loginSuccessful(data);
            },
            error => {
              this.loginUnsuccessful(error);
            });
      });
    });
  }

  private loginSuccessful(data: any) {
    console.log(data);
    this.loggingInProgress = false;
    this.webSocketInitService.initSocket();


    this.router.navigate(['/my-account']);
  }

  private loginUnsuccessful(error: any) {
    if (error.status === 401) {
      console.log(error);
      this.logInError = true;
    }
    this.loggingInProgress = false;
  }
}
