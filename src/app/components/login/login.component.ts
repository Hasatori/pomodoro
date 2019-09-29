import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {log} from 'util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  elegantForm: FormGroup;
  logInError = false;
  loggingInProgress = false;

  constructor(public fb: FormBuilder, private authenticationService: AuthService, private router: Router) {
    this.elegantForm = fb.group({
      elegantFormUsernameEx: ['', [Validators.required]],
      elegantFormPasswordEx: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  signIn(username: string, password: string) {

    this.loggingInProgress = true;
    this.authenticationService.login(username, password).pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.loggingInProgress = false;
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
