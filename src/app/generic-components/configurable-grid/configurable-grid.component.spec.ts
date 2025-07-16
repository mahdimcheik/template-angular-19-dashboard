import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurableGridComponent } from './configurable-grid.component';

describe('ConfigurableGridComponent', () => {
  let component: ConfigurableGridComponent;
  let fixture: ComponentFixture<ConfigurableGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurableGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurableGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
