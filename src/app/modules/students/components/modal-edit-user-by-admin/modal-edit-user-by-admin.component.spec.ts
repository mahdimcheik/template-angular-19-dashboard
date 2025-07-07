import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditUserByAdminComponent } from './modal-edit-user-by-admin.component';

describe('ModalEditUserByAdminComponent', () => {
  let component: ModalEditUserByAdminComponent;
  let fixture: ComponentFixture<ModalEditUserByAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditUserByAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditUserByAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
