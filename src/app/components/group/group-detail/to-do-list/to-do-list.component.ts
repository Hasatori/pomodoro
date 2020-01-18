import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  data = [
    {

      name: 'Root1',
      checked: false,
      children: [
        {
          name: 'FolderV1.0',
          cheched: false,
          children: [
            {
              name: 'FolderV2.0',
              checked: true,
              children: [],
            },
          ],
        },
        {
          name: 'FolderV2.0 (empty)',
          checked: false,
        },
      ],
    },
    {
      name: 'FolderV2.0 (empty)',
    },
    {
      name: 'FolderV3.0 (empty)',
      checked: false,
    },
    {
      name: 'Root2',
      checked: true,
    },
  ];

  onCheck(e: any) {
    console.log('%c Returned checked object ', 'background: #222; color:  #ff8080');
    console.log(e);
    console.log('%c ************************************ ', 'background: #222; color: #bada05');
  }
  onCheckedKeys(e: any) {
    console.log('%c Returned array with checked checkboxes ', 'background: #222; color: #bada55');
    console.log(e);
    console.log('%c ************************************ ', 'background: #222; color: #bada05');
  }
  onNodesChanged(e: any) {
    console.log('%c Returned json with marked checkboxes ', 'background: #222; color: #99ccff');
    console.table(e);
    console.log('%c ************************************ ', 'background: #222; color: #bada05');
  }
}
