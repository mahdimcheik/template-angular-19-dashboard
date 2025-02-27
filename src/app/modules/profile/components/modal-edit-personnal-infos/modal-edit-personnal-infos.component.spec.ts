import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditPersonnalInfosComponent } from './modal-edit-personnal-infos.component';

describe('ModalEditPersonnalInfosComponent', () => {
  let component: ModalEditPersonnalInfosComponent;
  let fixture: ComponentFixture<ModalEditPersonnalInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditPersonnalInfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditPersonnalInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
