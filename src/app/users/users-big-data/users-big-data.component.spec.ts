import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersBigDataComponent } from './users-big-data.component';

describe('UsersDataComponent', () => {
  let component: UsersBigDataComponent;
  let fixture: ComponentFixture<UsersBigDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersBigDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersBigDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
