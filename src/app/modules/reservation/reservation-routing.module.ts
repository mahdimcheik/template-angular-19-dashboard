import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarForTeacherComponent } from './pages/calendar-for-teacher/calendar-for-teacher.component';
import { CalendarForStudentComponent } from './pages/calendar-for-student/calendar-for-student.component';
import { ReservationsTeacherComponent } from './pages/reservations-teacher/reservations-teacher.component';
import { OrdersComponent } from './pages/orders/orders.component';

const routes: Routes = [
    {
        path: 'calendar-for-teacher',
        component: CalendarForTeacherComponent
    },
    {
        path: 'calendar-for-student',
        component: CalendarForStudentComponent
    },
    {
        path: 'teacher',
        component: ReservationsTeacherComponent
    },
    {
        path: 'orders-student',
        component: OrdersComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReservationRoutingModule {}
