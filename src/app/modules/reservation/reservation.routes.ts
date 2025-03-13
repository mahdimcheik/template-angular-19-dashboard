import { Routes } from '@angular/router';
import { CalendarForTeacherComponent } from './pages/calendar-for-teacher/calendar-for-teacher.component';
import { CalendarForStudentComponent } from './pages/calendar-for-student/calendar-for-student.component';
import { ReservationsTeacherComponent } from './pages/reservations-teacher/reservations-teacher.component';
import { OrdersComponent } from './pages/orders/orders.component';
export default [
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
] as Routes;
