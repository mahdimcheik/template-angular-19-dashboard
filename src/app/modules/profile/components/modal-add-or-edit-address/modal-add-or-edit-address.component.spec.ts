import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddOrEditAddressComponent } from './modal-add-or-edit-address.component';

describe('ModalAddOrEditAddressComponent', () => {
  let component: ModalAddOrEditAddressComponent;
  let fixture: ComponentFixture<ModalAddOrEditAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalAddOrEditAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddOrEditAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
