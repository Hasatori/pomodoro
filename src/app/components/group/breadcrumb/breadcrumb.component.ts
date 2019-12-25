import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../../services/group.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumb: string = null;

  constructor(private groupService: GroupService, private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.breadcrumb=null;
        let crumbs=event.url.toString().split('/');
         if (crumbs.length>2){
        this.breadcrumb =decodeURI(crumbs[crumbs.length-1]);
         }
      }
    });
  }

  ngOnInit() {

  }
}
