import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../services/group.service';
import {first} from 'rxjs/operators';
import {Group} from '../../redux/group/group';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

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
