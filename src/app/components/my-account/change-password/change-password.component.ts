import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {first} from 'rxjs/operators';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  elegantForm: FormGroup;
  elegantFormOldPassword: AbstractControl;
  elegantFormNewPassword: AbstractControl;
  elegantFormNewPasswordConfirm: AbstractControl;

  oldPasswordError: string = null;
  newPasswordError: string = null;
  newPasswordConfirmError: string = null;
  success: string = null;
  submitted: boolean = false;
  inProgress: boolean = false;

  constructor(private userService: UserService, public fb: FormBuilder) {
    this.elegantForm = fb.group({
      'elegantFormOldPassword': ['', Validators.required],
      'elegantFormNewPassword': ['', Validators.required],
      'elegantFormNewPasswordConfirm': [''],
    });
    this.elegantFormOldPassword = this.elegantForm.controls['elegantFormOldPassword'];
    this.elegantFormNewPassword = this.elegantForm.controls['elegantFormNewPassword'];
    this.elegantFormNewPasswordConfirm = this.elegantForm.controls['elegantFormNewPasswordConfirm'];
  }

  ngOnInit() {
  }


  public changePassword(oldPassword: string, newPassword: string, confirmNewPassword: string) {
    this.reset();
    this.submitted = true;
    if (newPassword === confirmNewPassword && oldPassword !== newPassword) {
      this.inProgress = true;
      this.userService.changePassword(oldPassword, newPassword).pipe(first()).subscribe(
        response => {
          this.success = response.addUserSuccess;
          this.inProgress = false;
        }, errorResponse => {
          console.log(errorResponse);
          this.oldPasswordError = errorResponse.error.oldPassword;
          this.newPasswordError = errorResponse.error.newPassword;
          this.newPasswordConfirmError =errorResponse.error.newPasswordConfirm;
          this.inProgress = false;
          console.log(this.newPasswordConfirmError);
        }
      );
    }
  }

  private reset() {
    this.oldPasswordError = null;
    this.newPasswordError = null;
    this.newPasswordConfirmError = null;
    this.success = null;
    this.submitted = false;
    this.inProgress = false;
  }
}
