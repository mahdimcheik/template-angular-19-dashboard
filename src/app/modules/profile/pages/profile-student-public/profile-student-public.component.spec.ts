import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileStudentPublicComponent } from './profile-student-public.component';

describe('ProfileStudentPublicComponent', () => {
  let component: ProfileStudentPublicComponent;
  let fixture: ComponentFixture<ProfileStudentPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileStudentPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileStudentPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
