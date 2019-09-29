import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'angular-bootstrap-md';
import {AuthService} from '../../services/auth.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  public chartType: string = 'line';
  public dayToPast: number = 5;


  public constructor(private authenticationService: AuthService) {

  }

  public chartDatasets: Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset'}
  ];

  public chartLabels: Array<any>;

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  ngOnInit(): void {
    this.chartLabels = this.getChartLabels();

  }

  private getChartLabels(): Array<string> {
    const result = new Array();
    let dd;
    let mm;
    let yyyy;
    let date;
    for (let i = this.dayToPast; i >= 0; i--) {
      date = new Date(Date.now() - 86400000 * i);
      dd = String(date.getDate()).padStart(2, '0');
      mm = String(date.getMonth() + 1).padStart(2, '0');
      yyyy = date.getFullYear();
      date = mm + '/' + dd + '/' + yyyy;
      result.push(date);
    }
    return result;
  }

  changeDays(daysToPast: string): void {
    console.log(daysToPast);
    this.dayToPast = Number(daysToPast);
    this.ngOnInit();
    this.authenticationService.test().pipe(first()).subscribe(
      response => {
        console.log(response);
      }
    );
  }
}
