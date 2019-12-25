import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {GroupService} from '../../../services/group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Group} from '../../../model/group';

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  private groups: Array<Group>;

  constructor(private groupService: GroupService) {
    this.groupService.getGroups().pipe(first()).subscribe(groups => {
      console.log(groups);
      this.groups = groups;
    });

  }

  ngOnInit() {
  }

}
