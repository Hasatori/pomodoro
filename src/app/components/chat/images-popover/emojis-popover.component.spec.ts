import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojisPopoverComponent } from './emojis-popover.component';

describe('EmojisPopoverComponent', () => {
  let component: EmojisPopoverComponent;
  let fixture: ComponentFixture<EmojisPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmojisPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojisPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
