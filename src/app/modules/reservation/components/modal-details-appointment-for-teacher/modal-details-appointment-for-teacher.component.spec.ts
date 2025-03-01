import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsAppointmentForTeacherComponent } from './modal-details-appointment-for-teacher.component';

describe('ModalDetailsAppointmentForTeacherComponent', () => {
  let component: ModalDetailsAppointmentForTeacherComponent;
  let fixture: ComponentFixture<ModalDetailsAppointmentForTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetailsAppointmentForTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetailsAppointmentForTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
