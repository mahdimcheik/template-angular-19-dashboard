import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditOrAddFormationComponent } from './modal-edit-or-add-formation.component';

describe('ModalEditOrAddFormationComponent', () => {
  let component: ModalEditOrAddFormationComponent;
  let fixture: ComponentFixture<ModalEditOrAddFormationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEditOrAddFormationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditOrAddFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
