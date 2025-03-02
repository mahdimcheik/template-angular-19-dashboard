import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationListByTeacherComponent } from './reservation-list-by-teacher.component';

describe('ReservationListByTeacherComponent', () => {
  let component: ReservationListByTeacherComponent;
  let fixture: ComponentFixture<ReservationListByTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationListByTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationListByTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
