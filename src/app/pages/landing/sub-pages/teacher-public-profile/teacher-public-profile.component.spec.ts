import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPublicProfileComponent } from './teacher-public-profile.component';

describe('TeacherPublicProfileComponent', () => {
  let component: TeacherPublicProfileComponent;
  let fixture: ComponentFixture<TeacherPublicProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherPublicProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherPublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
