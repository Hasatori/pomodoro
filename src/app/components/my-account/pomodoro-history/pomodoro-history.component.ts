import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {Pomodoro} from '../../../model/pomodoro/pomodoro';

@Component({
  selector: 'pomodoro-history',
  templateUrl: './pomodoro-history.component.html',
  styleUrls: ['./pomodoro-history.component.scss']
})
export class PomodoroHistoryComponent implements OnInit {
  public chartType: string = 'bar';
  public dayToPast: number = 5;
  private pomodoros: Array<Pomodoro>;

  constructor(private userService: UserService) {

  }

  public chartDatasets: Array<any> = [
    {data: [], label: 'Finished pomodoros'}, {data: [], label: 'Interrputed pomodoros'}
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
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  ngOnInit(): void {
    this.chartLabels = this.getChartLabels();
    this.userService.userPomodoros().pipe(first()).subscribe(
      pomodoros => {
        this.pomodoros = pomodoros;
        const finishedPomodoros = [];
        const notFinishedPomodoros = [];
        for (let chartLabel of this.chartLabels) {

          finishedPomodoros.push(pomodoros.filter(pomodoro => pomodoro.date === chartLabel && pomodoro.interrupted === false).length);
          notFinishedPomodoros.push(pomodoros.filter(pomodoro => pomodoro.date === chartLabel && pomodoro.interrupted !== false).length);
        }
        console.log(finishedPomodoros);
        this.chartDatasets = [
          {data: finishedPomodoros, label: 'Finished pomodoros'},
          {data: notFinishedPomodoros, label: 'Interrputed pomodoros'}
        ];

      }
    );
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
      date = yyyy + '-' + mm + '-' + dd;
      result.push(date);
    }
    return result;
  }

  changeDays(daysToPast: string): void {
    console.log(daysToPast);
    this.dayToPast = Number(daysToPast);
    this.ngOnInit();

  }
}
