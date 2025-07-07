import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsReservationComponent } from './modal-details-reservation.component';

describe('ModalDetailsReservationComponent', () => {
  let component: ModalDetailsReservationComponent;
  let fixture: ComponentFixture<ModalDetailsReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetailsReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetailsReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
