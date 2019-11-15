import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PomodoroIsRunningComponent } from './pomodoro-is-running.component';

describe('PomodoroIsRunningComponent', () => {
  let component: PomodoroIsRunningComponent;
  let fixture: ComponentFixture<PomodoroIsRunningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PomodoroIsRunningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PomodoroIsRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
