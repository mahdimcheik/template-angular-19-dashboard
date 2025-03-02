import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBookOrUnbookComponent } from './modal-book-or-unbook.component';

describe('ModalBookOrUnbookComponent', () => {
  let component: ModalBookOrUnbookComponent;
  let fixture: ComponentFixture<ModalBookOrUnbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalBookOrUnbookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBookOrUnbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
