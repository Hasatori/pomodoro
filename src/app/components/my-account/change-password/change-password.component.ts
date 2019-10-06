import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  incorrectPassword: boolean = false;
  passwordsDoesNotMatch: boolean = false;
  noValueWasChanged: boolean = false;
  inProgress: boolean = false;
  success: boolean = false;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }


  public changePassword(oldPassword: string, newPassword: string, confirmNewPassword: string) {
    this.inProgress = true;
    this.passwordsDoesNotMatch = false;
    this.incorrectPassword = false;
    this.noValueWasChanged = false;
    this.success = false;

    if (newPassword !== confirmNewPassword) {
      this.passwordsDoesNotMatch = true;
      this.inProgress = false;
    } else if (oldPassword === newPassword) {
      this.noValueWasChanged = true;
      this.inProgress = false;
    } else {
      this.userService.changePassword(oldPassword, newPassword).pipe(first()).subscribe(
        response => {
          this.inProgress = false;
          this.success = true;
        }, error1 => {
          if (error1.status == 400) {
            this.incorrectPassword = true;
          }
          this.inProgress = false;
        }
      );
    }
  }

}
