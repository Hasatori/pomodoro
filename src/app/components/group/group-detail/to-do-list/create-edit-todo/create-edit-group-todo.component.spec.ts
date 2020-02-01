import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditGroupTodoComponent } from './create-edit-group-todo.component';

describe('CreateEditUserTodoComponent', () => {
  let component: CreateEditGroupTodoComponent;
  let fixture: ComponentFixture<CreateEditGroupTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditGroupTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditGroupTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
