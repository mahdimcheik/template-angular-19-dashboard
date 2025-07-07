import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsListDetailedComponent } from './reservations-list-detailed.component';

describe('ReservationsListDetailedComponent', () => {
  let component: ReservationsListDetailedComponent;
  let fixture: ComponentFixture<ReservationsListDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsListDetailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationsListDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
