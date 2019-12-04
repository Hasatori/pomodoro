import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WantMoreFunctionalityComponent } from './want-more-functionality.component';

describe('WantMoreFunctionalityComponent', () => {
  let component: WantMoreFunctionalityComponent;
  let fixture: ComponentFixture<WantMoreFunctionalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WantMoreFunctionalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WantMoreFunctionalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
