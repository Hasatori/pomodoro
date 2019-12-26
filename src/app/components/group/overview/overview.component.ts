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
  private unreadMessages: Map<Group, number> = new Map<Group, number>();

  constructor(private groupService: GroupService) {
    this.groupService.getGroups().pipe(first()).subscribe(groups => {
      this.groups = groups;
      /*for (let group of groups) {
        this.unreadMessages.set(group, 0);
        this.groupService.getAllUnreadMessages(group.name).subscribe(unreadMessages => {
          this.unreadMessages.set(group, this.unreadMessages.get(group) + unreadMessages.length);
        });
        groupService.getNewGroupMessage(group.name).subscribe((newMessages) => {
          this.unreadMessages.set(group, this.unreadMessages.get(group) + 1);
        });
      }*/
    });

  }

  ngOnInit() {
  }

}
