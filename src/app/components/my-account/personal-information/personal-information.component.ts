import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {User} from '../../../model/user';
import {first} from 'rxjs/operators';
import {nocollapseHack} from '@angular/compiler-cli/src/transformers/nocollapse_hack';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SuccessComponent} from '../../modals/success/success.component';

@Component({
  selector: 'personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  user: User;
  inProgress: boolean = false;
  submitted: boolean = false;
  emailError: string;
  nameError: string;
  success: string;
  elegantForm: FormGroup;
  elegantFormUsername: AbstractControl;
  elegantFormEmail: AbstractControl;
  // @ts-ignore
  @ViewChild('successComponent') successComponent: SuccessComponent;

  constructor(private userService: UserService, public fb: FormBuilder) {
    this.elegantForm = fb.group({
      'elegantFormUsername': ['', [Validators.required]],
      'elegantFormEmail': ['', [Validators.required, Validators.pattern(/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm)]],
    });
    this.elegantFormUsername = this.elegantForm.controls['elegantFormUsername'];
    this.elegantFormEmail = this.elegantForm.controls['elegantFormEmail'];
    userService.getUser().pipe(first()).subscribe(
      user => {
        this.user = user;
        this.elegantFormEmail.setValue(this.user.email);
        this.elegantFormUsername.setValue(this.user.username);
      }
    );
  }

  ngOnInit() {
  }

  private reset() {
    this.inProgress = false;
    this.submitted = false;
    this.emailError = null;
    this.nameError = null;
    this.success = null;
  }

  updateUser(firstName: string, secondName: string, username: string, email: string) {
    this.reset();
    this.submitted = true;
    console.log(`${firstName} ${secondName} ${username} ${email}`);
    if (firstName === this.user.firstName && secondName === this.user.lastName && username === this.user.username && email === this.user.email) {
    } else {
      this.inProgress = true;
      let updatedUser = new User();
      updatedUser.firstName = firstName;
      updatedUser.lastName = secondName;
      updatedUser.username = username;
      updatedUser.email = email;
      console.log(updatedUser.firstName);
      this.userService.updateUser(updatedUser).pipe(first()).subscribe(
        response => {
          this.reset();
          this.success = response.success;
          this.user = updatedUser;
        }
        , error1 => {
          this.reset();
          this.emailError = error1.error.email;
          this.nameError = error1.error.username;

        });
    }
  }
}
