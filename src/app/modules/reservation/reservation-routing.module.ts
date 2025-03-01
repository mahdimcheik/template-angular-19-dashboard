import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page1Component } from './pages/page1/page1.component';
import { Page2Component } from './pages/page2/page2.component';
import { CalendarForTeacherComponent } from './pages/calendar-for-teacher/calendar-for-teacher.component';

const routes: Routes = [
    {
        path: 'calendar-for-teacher',
        component: CalendarForTeacherComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReservationRoutingModule {}
