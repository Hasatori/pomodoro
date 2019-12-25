import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../services/group.service';
import {first} from 'rxjs/operators';
import {Group} from '../../model/group';
import {ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router} from '@angular/router';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {


}
