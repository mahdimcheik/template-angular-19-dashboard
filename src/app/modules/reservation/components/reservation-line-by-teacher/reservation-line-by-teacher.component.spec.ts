import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationLineByTeacherComponent } from './reservation-line-by-teacher.component';

describe('ReservationLineByTeacherComponent', () => {
  let component: ReservationLineByTeacherComponent;
  let fixture: ComponentFixture<ReservationLineByTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationLineByTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationLineByTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
