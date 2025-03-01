import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { ReservationRoutingModule } from './reservation-routing.module';
import { CalendarForTeacherComponent } from './pages/calendar-for-teacher/calendar-for-teacher.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { FieldsetModule } from 'primeng/fieldset';
import { HelpTypePipe } from '../../shared/pipes/help-type.pipe';
import { ModalDetailsAppointmentForTeacherComponent } from './components/modal-details-appointment-for-teacher/modal-details-appointment-for-teacher.component';
import { ModalCreateAppointmentComponent } from './components/modal-create-appointment/modal-create-appointment.component';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { TabsModule } from 'primeng/tabs';
import { SplitterModule } from 'primeng/splitter';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RippleModule } from 'primeng/ripple';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { PopoverModule } from 'primeng/popover';
import { MessageModule } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';
import { GenericMessageComponent } from '../../pages/uikit/generic-message/generic-message.component';
import { TextareaModule } from 'primeng/textarea';
import { RequiredAsteriskDirective } from '../../shared/directives/required-asterisk.directive';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ModalEditAppointmentComponent } from './components/modal-edit-appointment/modal-edit-appointment.component';
import { CalendarForStudentComponent } from './pages/calendar-for-student/calendar-for-student.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [CalendarForTeacherComponent, ModalDetailsAppointmentForTeacherComponent, ModalCreateAppointmentComponent, ModalEditAppointmentComponent, CalendarForStudentComponent],
    imports: [
        CommonModule,
        ReservationRoutingModule,
        HelpTypePipe,
        CommonModule,
        FullCalendarModule,
        ButtonModule,
        DialogModule,
        FormsModule,
        TableModule,
        PaginatorModule,
        FieldsetModule,
        FluidModule,
        SelectModule,
        FormsModule,
        ToolbarModule,
        TabsModule,
        SplitterModule,
        SplitButtonModule,
        RippleModule,
        PanelModule,
        MenuModule,
        ReactiveFormsModule,
        PopoverModule,
        MessageModule,
        ReactiveFormsModule,
        DatePickerModule,
        GenericMessageComponent,
        TextareaModule,
        RequiredAsteriskDirective,
        FileUploadModule,
        DialogModule,
        RadioButtonModule,
        InputNumberModule
    ]
})
export class ReservationModule {}
