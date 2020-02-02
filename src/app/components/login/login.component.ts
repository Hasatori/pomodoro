import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService as FacebookAuth, FacebookLoginProvider} from 'angularx-social-login';
import {UserServiceProvider} from '../../services/user-service-provider';

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
  submitted: boolean = false;

  constructor(public fb: FormBuilder, private router: Router, private facebookAuth: FacebookAuth, public userServiceProvider: UserServiceProvider) {
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
    this.submitted=true;
    this.elegantFormPasswordEx.markAsTouched();
    this.elegantFormUsernameEx.markAsTouched();
    if (this.elegantForm.valid) {
      this.loggingInProgress = true;
      this.userServiceProvider.authService.login(username, password).pipe(first())
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
        this.userServiceProvider.authService.loginWithFB(facebookResponse).pipe(first())
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
    this.userServiceProvider.webSocketManagerService.initAllSockets();


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
