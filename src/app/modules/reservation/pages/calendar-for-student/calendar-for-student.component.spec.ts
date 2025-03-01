import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarForStudentComponent } from './calendar-for-student.component';

describe('CalendarForStudentComponent', () => {
  let component: CalendarForStudentComponent;
  let fixture: ComponentFixture<CalendarForStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarForStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarForStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
