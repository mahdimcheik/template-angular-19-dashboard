import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarForTeacherComponent } from './calendar-for-teacher.component';

describe('CalendarForTeacherComponent', () => {
  let component: CalendarForTeacherComponent;
  let fixture: ComponentFixture<CalendarForTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarForTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarForTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
