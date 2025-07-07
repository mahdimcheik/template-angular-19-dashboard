import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsPageComponent } from './reservations-teacher.component';

describe('ReservationsTeacherComponent', () => {
    let component: ReservationsPageComponent;
    let fixture: ComponentFixture<ReservationsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReservationsPageComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ReservationsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
