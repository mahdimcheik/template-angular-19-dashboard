import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditAppointmentComponent } from './modal-edit-appointment.component';

describe('ModalEditAppointmentComponent', () => {
  let component: ModalEditAppointmentComponent;
  let fixture: ComponentFixture<ModalEditAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEditAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
