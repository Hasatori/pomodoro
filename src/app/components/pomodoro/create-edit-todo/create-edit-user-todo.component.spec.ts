import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditUserTodoComponent } from './create-edit-user-todo.component';

describe('CreateEditUserTodoComponent', () => {
  let component: CreateEditUserTodoComponent;
  let fixture: ComponentFixture<CreateEditUserTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditUserTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditUserTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
