import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsTeacherComponent } from './reservations-teacher.component';

describe('ReservationsTeacherComponent', () => {
  let component: ReservationsTeacherComponent;
  let fixture: ComponentFixture<ReservationsTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationsTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationsTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
