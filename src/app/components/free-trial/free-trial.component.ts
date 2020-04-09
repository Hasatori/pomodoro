import {Component} from '@angular/core';
import {FreeTrialService} from '../../services/free-trial.service';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './free-trial.component.html',
  styleUrls: ['./free-trial.component.scss']
})
export class FreeTrialComponent {

  constructor(public freeTrialService:FreeTrialService) {
  }

}
