import {Component, OnInit, ViewChild} from '@angular/core';

import {first, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {error} from 'util';
import {User} from '../../model/user';
import {stringify} from 'querystring';
import {SuccessComponent} from '../modals/success/success.component';
import {ModalDirective} from 'angular-bootstrap-md';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {getEnvironment} from "../../ServerConfig";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  elegantForm: FormGroup;
  elegantFormUsername: AbstractControl;
  elegantFormPassword: AbstractControl;
  elegantFormPasswordConfirm: AbstractControl;
  elegantFormEmail: AbstractControl;

  inProgress:boolean=false;
  submitted:boolean=false;
  passwordError: string;
  nameError: string;
  emailError: string;
  success: string;
  // @ts-ignore
  @ViewChild('successComponent') successComponent: SuccessComponent;

  constructor(private http: HttpClient, private router: Router, public fb: FormBuilder) {
    this.elegantForm = fb.group({
      'elegantFormUsername': ['', [Validators.required]],
      'elegantFormPassword': ['', Validators.required],
      'elegantFormPasswordConfirm': [''],
      'elegantFormEmail': ['',[Validators.required,Validators.pattern(/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm)]],
    });
    this.elegantFormPassword = this.elegantForm.controls['elegantFormPassword'];
    this.elegantFormPasswordConfirm = this.elegantForm.controls['elegantFormPasswordConfirm'];
    this.elegantFormUsername = this.elegantForm.controls['elegantFormUsername'];
    this.elegantFormEmail = this.elegantForm.controls['elegantFormEmail'];
  }

  ngOnInit() {

  }

  signUp(firstName: string, lastName: string, username: string, password: string, confirmPassword, email: string) {
    this.submitted=true;
    if (username !== '' && email !== '' && password !== '' && (password === confirmPassword)) {
      this.inProgress=true;
      let newUser=new User();
      newUser.firstName=firstName;
      newUser.lastName=lastName;
      newUser.username=username;
      newUser.password=password;
      newUser.email=email;
      this.http.post<any>(`${getEnvironment().backend}register`, newUser).pipe(map(response => {
        return response;
      })).pipe(first()).subscribe((result) => {
        this.successComponent.show('Registration', result.Success);
        this.successComponent.onHide().subscribe(() => this.router.navigate(['/login']));
        this.inProgress=false;
      }, error1 => {
        this.passwordError = error1.error.password;
        this.emailError = error1.error.email;
        this.nameError = error1.error.username;
        this.inProgress=false;
      });
    }
  }
}
