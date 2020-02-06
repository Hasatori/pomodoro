import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'angular-bootstrap-md';
import {AuthService} from '../../services/auth.service';
import {first} from 'rxjs/operators';
import {UserServiceProvider} from '../../services/user-service-provider';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {


  public constructor(){}

}
