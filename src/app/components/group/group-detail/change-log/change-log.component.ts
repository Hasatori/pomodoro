import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserServiceProvider} from '../../../../services/user-service-provider';
import {GroupChange} from '../../../../model/group-change';
import {Group} from '../../../../model/group';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.scss']
})
export class ChangeLogComponent implements OnInit, OnDestroy {
  @Input() group: Group;

  private changes: Array<GroupChange> = [];
  private threshold = 0;
  private limit = 10;
  private end = this.threshold + this.limit;
  private newGroupChangeSubscription: Subscription;

  constructor(private userServiceProvider: UserServiceProvider) {
  }

  ngOnInit() {
    this.userServiceProvider.groupService.getLastNumberOfGroupChanges(this.group.name, this.threshold, this.end).subscribe((changes) => {
      this.changes = changes.sort(function(a, b) {
        return new Date(a.changeTimestamp).getTime() - new Date(b.changeTimestamp).getTime();
      });
      this.threshold += this.limit;
      this.end += this.limit;
    });
    this.newGroupChangeSubscription = this.userServiceProvider.groupService.getNewGroupChange(this.group.name).subscribe(change => {
      this.changes.push(change);
    });

  }

  ngOnDestroy(): void {
    this.newGroupChangeSubscription.unsubscribe();
  }

}
