import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PomodoroService} from '../../../services/pomodoro.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {GroupService} from '../../../services/group.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  noValueChanged: boolean;
  inProgress: boolean;
  nameNotFilled: boolean = false;
  success: boolean = false;
  constructor(private groupService: GroupService, private router: Router) {
  }

  ngOnInit() {
  }

  createGroup(name: string, isPublic: boolean) {
    this.nameNotFilled = false;
    if (name.trim() === '') {
      this.nameNotFilled = true;
    } else {
      this.groupService.createGroup(name, isPublic).pipe(first()).subscribe(
        response => {
          this.router.navigate(['group/'+name])
            .then(() => {
              window.location.reload();
            });
        }, error => {

        }
      );
    }
  }
}