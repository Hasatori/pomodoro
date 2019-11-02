import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {User} from '../../../model/user';
import {first} from 'rxjs/operators';
import {nocollapseHack} from '@angular/compiler-cli/src/transformers/nocollapse_hack';

@Component({
  selector: 'personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  user: User;
  noValueChanged: boolean = false;
  inProgress: boolean = false;
  updatedUser: User;

  constructor(private userService: UserService) {
    userService.getUser().pipe(first()).subscribe(
      user => {
        this.user = user;
      }
    );
  }

  ngOnInit() {
  }

  updateUser(firstName: string, secondName: string, username: string, email: string) {
    this.inProgress = true;
    this.noValueChanged = false;
    if (firstName === this.user.firstName && secondName === this.user.lastName && username === this.user.username && email === this.user.email) {
      this.noValueChanged = true;
      this.inProgress = false;
    } else {
      this.updatedUser = new User();
      this.updatedUser.firstName = firstName;
      this.updatedUser.lastName = secondName;
      this.updatedUser.username = username;
      this.updatedUser.email = email;
      console.log(this.updatedUser.firstName);
      this.userService.updateUser(this.updatedUser).pipe(first()).subscribe(
        response => {
          this.inProgress = false;
            this.user = this.updatedUser;

        }
      );
    }
  }
}
