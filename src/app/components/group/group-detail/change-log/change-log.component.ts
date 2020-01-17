import {Component, Input, OnInit} from '@angular/core';
import {UserServiceProvider} from '../../../../services/user-service-provider';
import {GroupChange} from '../../../../model/group-change';
import {Group} from '../../../../model/group';

@Component({
  selector: 'app-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.scss']
})
export class ChangeLogComponent implements OnInit {
  @Input() group: Group;

  private changes: Array<GroupChange> = [];
  private threshold = 0;
  private limit = 10;
  private end = this.threshold + this.limit;

  constructor(private userServiceProvider: UserServiceProvider) {
  }

  ngOnInit() {
    this.userServiceProvider.groupService.getLastNumberOfGroupChanges(this.group.name, this.threshold, this.end).subscribe((changes) => {
      this.changes =changes.sort(function(a, b) {
        return new Date(a.changeTimestamp).getTime() - new Date(b.changeTimestamp).getTime();
      });
      this.threshold += this.limit;
      this.end += this.limit;
    });
  }

}
