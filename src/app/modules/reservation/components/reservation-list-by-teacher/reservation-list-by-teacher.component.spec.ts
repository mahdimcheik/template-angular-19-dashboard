import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationListComponent } from './reservation-list-by-teacher.component';

describe('ReservationListByTeacherComponent', () => {
    let component: ReservationListComponent;
    let fixture: ComponentFixture<ReservationListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReservationListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ReservationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
