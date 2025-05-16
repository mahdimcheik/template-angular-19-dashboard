import { Routes } from '@angular/router';
import { CalendarForTeacherComponent } from './pages/calendar-for-teacher/calendar-for-teacher.component';
import { CalendarForStudentComponent } from './pages/calendar-for-student/calendar-for-student.component';
import { ReservationsPageComponent } from './pages/reservations-teacher/reservations-teacher.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { isAdminOnlyGuard, isStudentOnlyGuard } from '../../shared/guards/is-admin-only.guard';
export default [
    {
        path: 'calendar-for-teacher',
        component: CalendarForTeacherComponent,
        canActivate: [isAdminOnlyGuard]
    },
    {
        path: 'calendar-for-student',
        component: CalendarForStudentComponent,
        canActivate: [isStudentOnlyGuard]
    },
    {
        path: 'list',
        component: ReservationsPageComponent
    },
    {
        path: 'orders-student',
        component: OrdersComponent,
        canActivate: [isStudentOnlyGuard]
    }
] as Routes;
