import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCardsComponent } from './users-cards.component';

describe('UsersCardsComponent', () => {
  let component: UsersCardsComponent;
  let fixture: ComponentFixture<UsersCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
