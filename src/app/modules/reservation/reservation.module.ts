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
import { CalendarForStudentComponent } from './pages/calendar-for-student/calendar-for-student.component';
import { InputTextModule } from 'primeng/inputtext';
import { ReservationLineByTeacherComponent } from './components/reservation-line-by-teacher/reservation-line-by-teacher.component';
import { ReservationListByTeacherComponent } from './components/reservation-list-by-teacher/reservation-list-by-teacher.component';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReservationsTeacherComponent } from './pages/reservations-teacher/reservations-teacher.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderStatusPipe } from '../../shared/pipes/order-status.pipe';

registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ReservationRoutingModule,
        HelpTypePipe,
        FullCalendarModule,
        ButtonModule,
        DialogModule,
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
        InputNumberModule,
        InputTextModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        OrderStatusPipe
    ]
})
export class ReservationModule {}
