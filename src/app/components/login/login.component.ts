import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {log} from 'util';
import {PomodoroService} from '../../services/pomodoro.service';

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

  constructor(public fb: FormBuilder, private authenticationService: AuthService, private router: Router,private pomodoroService:PomodoroService) {
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
            console.log(data);
            this.loggingInProgress = false;
            this.pomodoroService.initSocket();
            this.router.navigate(['/my-account']);
          },
          error => {

            if (error.status === 401) {
              console.log(error);
              this.logInError = true;
            }
            this.loggingInProgress = false;
          });
    }
  }

}
