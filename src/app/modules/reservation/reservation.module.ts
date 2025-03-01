import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { ReservationRoutingModule } from './reservation-routing.module';
import { CalendarForTeacherComponent } from './pages/calendar-for-teacher/calendar-for-teacher.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { FieldsetModule } from 'primeng/fieldset';
import { HelpTypePipe } from '../../shared/pipes/help-type.pipe';
import { ModalDetailsAppointmentForTeacherComponent } from './components/modal-details-appointment-for-teacher/modal-details-appointment-for-teacher.component';
registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [CalendarForTeacherComponent, ModalDetailsAppointmentForTeacherComponent],
    imports: [CommonModule, ReservationRoutingModule, HelpTypePipe, CommonModule, FullCalendarModule, ButtonModule, DialogModule, FormsModule, TableModule, PaginatorModule, FieldsetModule]
})
export class ReservationModule {}
