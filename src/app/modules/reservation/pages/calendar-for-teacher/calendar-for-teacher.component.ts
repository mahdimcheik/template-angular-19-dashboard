import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SlotMainService } from '../../../../shared/services/slotMain.service';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { CalendarOptions, DateSelectArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core/index.js';
import { EventContentArg } from '@fullcalendar/core/index.js';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin, { EventResizeDoneArg, EventResizeStopArg } from '@fullcalendar/interaction';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';
import { ModalCreateAppointmentComponent } from '../../components/modal-create-appointment/modal-create-appointment.component';

@Component({
    selector: 'app-calendar-for-teacher',
    imports: [ButtonModule, FullCalendarModule, CommonModule, HelpTypePipe, ModalCreateAppointmentComponent],

    templateUrl: './calendar-for-teacher.component.html',
    styleUrl: './calendar-for-teacher.component.scss'
})
export class CalendarForTeacherComponent implements AfterViewInit {
    slotService = inject(SlotMainService);
    visibleEvents = this.slotService.visibleEvents; // signal
    userConnected = inject(UserMainService).userConnected; // signal

    isVisibleModalCreate: boolean = false;
    isVisibleModalUpdate: boolean = false;

    showCreateAppointmentModal = signal<boolean>(false);
    showEditAppointmentModal = signal<boolean>(false);

    @ViewChild('calendar')
    calendarComponent!: FullCalendarComponent;
    displayModal: boolean = false;
    dateStart!: string;
    dateEnd!: string;
    currentDate!: Date;
    isCreatingAppointment: boolean = true;
    selectedSlot = signal<EventInput>({ start: new Date(), end: new Date() }); //  EventInput = { start: new Date(), end: new Date() }; // empty slot selected pas un appoitment
    selectedAppoitment = signal<EventInput>({ start: new Date(), end: new Date() }); // evenement déjà créé

    canDrop = (dropInfo: any, draggedEvent: any) => {
        var toto = dropInfo as EventInput;

        // if (this.selectedAppoitment().extendedProps?.['slot']?.['studentId'] != null) {
        //     return false;
        // }
        const now = new Date();
        return dropInfo.start >= now && draggedEvent.start >= now;
    };
    /// click sur un appointment, déjà créé
    // je vérifie si le créneau est déjà pris, et je le remet à jour
    onEventClick = (eventClickArg: EventClickArg) => {
        this.slotService.getSlotById(eventClickArg.event.extendedProps?.['slot']?.['id']).subscribe((res) => {
            this.selectedSlot.set(eventClickArg.event as EventInput);
            this.visibleEvents.set(this.visibleEvents().filter((x) => x.extendedProps?.['slot']?.['id'] !== eventClickArg.event.extendedProps?.['slot']?.['id']));
            this.visibleEvents.set([...this.visibleEvents(), res]);
            this.isCreatingAppointment = res.extendedProps?.['slot']?.['id'] == null;
            this.selectedAppoitment.set(res);
            this.showCreateAppointmentModal.set(true);
        });
    };
    onResize = (eventResizeArg: EventResizeDoneArg) => {
        this.selectedAppoitment.set(eventResizeArg.oldEvent as EventInput);
        this.selectedSlot.set(eventResizeArg.event as EventInput);

        this.slotService.getSlotById(eventResizeArg.oldEvent.extendedProps?.['slot']?.['id']).subscribe((res) => {
            this.selectedSlot.set({
                start: eventResizeArg.event.start as Date,
                end: eventResizeArg.event.end as Date
            });

            if (eventResizeArg.event.extendedProps?.['slot']?.['studentId'] != null) {
                this.visibleEvents.set(this.visibleEvents().filter((x) => x.extendedProps?.['slot']?.['id'] !== eventResizeArg.oldEvent.extendedProps?.['slot']?.['id']));
                this.visibleEvents.set([...this.visibleEvents(), res]);
                return;
            }
            this.isCreatingAppointment = false;
            this.selectedAppoitment.set(res);
            this.showCreateAppointmentModal.set(true);
        });
    };
    onDrop = (eventDropArg: EventDropArg) => {
        this.slotService.getSlotById(eventDropArg.oldEvent.extendedProps?.['slot']?.['id']).subscribe((res) => {
            this.selectedSlot.set({
                start: eventDropArg.event.start as Date,
                end: eventDropArg.event.end as Date
            });

            if (eventDropArg.event.extendedProps?.['slot']?.['studentId'] != null) {
                this.visibleEvents.set(this.visibleEvents().filter((x) => x.extendedProps?.['slot']?.['id'] !== eventDropArg.oldEvent.extendedProps?.['slot']?.['id']));
                this.visibleEvents.set([...this.visibleEvents(), res]);
                return;
            }
            this.isCreatingAppointment = false;
            this.selectedAppoitment.set(res);
            this.showCreateAppointmentModal.set(true);
        });
    };
    // click sur un slot vide, je crée un appoitment
    onDateSelect = (selectionInfo: DateSelectArg) => {
        this.selectedSlot.set({ start: selectionInfo.start, end: selectionInfo.end });
        this.selectedAppoitment.set({});
        this.isCreatingAppointment = true;
        this.showCreateAppointmentModal.set(true);
    };
    canStartDrag = (selectionInfo: any) => {
        if (selectionInfo.event?.extendedProps?.['slot']?.['studentId'] != null) return false;
        return selectionInfo.start > new Date();
    };

    loadSlot() {
        this.slotService.getSlotByCreator(this.userConnected().id!, this.dateStart, this.dateEnd).subscribe();
    }

    calendarOptions: CalendarOptions = {
        initialView: 'timeGridWeek',
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        locale: frLocale,
        headerToolbar: {
            right: '',
            left: '',
            center: ''
        },
        views: {
            dayGridMonth: {
                titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
            },
            timeGridFiveDays: {
                type: 'timeGrid',
                duration: { days: 4 }
            },

            validRange: {
                start: '2024-05-24'
            }
        },
        weekends: true,
        slotDuration: '00:15:00',
        slotMinTime: '09:00',
        slotMaxTime: '22:00',
        allDaySlot: false,
        navLinks: true,
        eventStartEditable: true,
        eventOverlap: false,
        weekNumbers: true,
        selectMirror: true,
        unselectAuto: true,
        selectOverlap: false,
        editable: true,
        selectable: true,
        eventDurationEditable: true,
        defaultTimedEventDuration: '01:00:00',
        nowIndicator: true,
        allDayText: 'Heures',
        droppable: false,
        eventResizableFromStart: true,

        eventResizeStop(arg) {},
        eventResize: this.onResize,
        select: this.onDateSelect,
        eventClick: this.onEventClick,
        // drag and drop
        selectAllow: this.canStartDrag, // can start drag event ?
        eventAllow: this.canDrop, // can drop ?
        eventDrop: this.onDrop, // drop

        eventColor: '#0000'
    };

    ngAfterViewInit(): void {
        const calendarApi = this.calendarComponent.getApi();
        this.dateStart = calendarApi.view.currentStart.toUTCString();
        this.dateEnd = calendarApi.view.currentEnd.toUTCString();
        this.currentDate = calendarApi.getDate();
        this.loadSlot();
    }

    updateViewDates() {
        const calendarApi = this.calendarComponent.getApi();
        this.dateStart = calendarApi.view.currentStart.toUTCString();
        this.dateEnd = calendarApi.view.currentEnd.toUTCString();
        this.currentDate = calendarApi.getDate();
        this.loadSlot();
    }

    next(): void {
        this.calendarComponent.getApi().next();
        this.updateViewDates();
    }
    prev(): void {
        this.calendarComponent.getApi().prev();
        this.updateViewDates();
    }
    getToday(): void {
        this.calendarComponent.getApi().today();
        this.updateViewDates();
    }
    weekView() {
        this.calendarComponent.getApi().changeView('timeGridWeek');
        this.updateViewDates();
    }
    monthView() {
        this.calendarComponent.getApi().changeView('dayGridMonth');
        this.updateViewDates();
    }
    dayView() {
        this.calendarComponent.getApi().changeView('timeGridDay');
        this.updateViewDates();
    }
    onModalSubmit() {
        this.loadSlot();
    }
}
