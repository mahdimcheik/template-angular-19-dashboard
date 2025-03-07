import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardItemOrderComponent } from './card-item-order.component';

describe('CardItemOrderComponent', () => {
  let component: CardItemOrderComponent;
  let fixture: ComponentFixture<CardItemOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardItemOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardItemOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
