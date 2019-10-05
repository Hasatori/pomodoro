import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PomodoroHistoryComponent } from './pomodoro-history.component';

describe('PomodoroHistoryComponent', () => {
  let component: PomodoroHistoryComponent;
  let fixture: ComponentFixture<PomodoroHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PomodoroHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PomodoroHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
