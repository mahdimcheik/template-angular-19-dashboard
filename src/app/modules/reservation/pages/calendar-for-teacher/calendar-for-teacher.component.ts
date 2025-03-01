import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SlotService } from '../../../../shared/services/slot.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { CalendarOptions, DateSelectArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core/index.js';
import { EventContentArg } from '@fullcalendar/core/index.js';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin, { EventResizeDoneArg, EventResizeStopArg } from '@fullcalendar/interaction';

@Component({
    selector: 'app-calendar-for-teacher',
    standalone: false,
    templateUrl: './calendar-for-teacher.component.html',
    styleUrl: './calendar-for-teacher.component.scss'
})
export class CalendarForTeacherComponent implements AfterViewInit {
    slotService = inject(SlotService);
    visibleEvents = this.slotService.visibleEvents; // signal
    userConnected = inject(AuthService).userConnected; // signal

    isVisibleModalCreate: boolean = false;
    isVisibleModalUpdate: boolean = false;

    showCreateAppointmentModal = signal<boolean>(false);
    showEditAppointmentModal = signal<boolean>(false);

    @ViewChild('calendar')
    calendarComponent!: FullCalendarComponent;
    events: EventInput[] = [];
    displayModal: boolean = false;
    dateStart!: string;
    dateEnd!: string;
    currentDate!: Date;
    selectedSlot = signal<EventInput>({ start: new Date(), end: new Date() }); //  EventInput = { start: new Date(), end: new Date() }; // empty slot selected pas un appoitment
    selectedAppoitment = signal<EventInput>({ start: new Date(), end: new Date() }); // evenement déjà créé

    canDrop = (dropInfo: any, draggedEvent: any) => {
        const now = new Date();
        return dropInfo.start >= now && draggedEvent.start >= now;
    };
    onEventClick = (eventClickArg: EventClickArg) => {
        this.selectedAppoitment.set(eventClickArg.event as EventInput);
        this.showEditAppointmentModal.set(true);
        this.selectedSlot.set(eventClickArg.event as EventInput);
        // console.log('selected slot ', eventClickArg.event);
        // this.slotService.selectedEvent.set(this.selectedAppoitment);
        // this.showCreateAppointmentModal.set(true);
    };
    onResize = (eventResizeArg: EventResizeDoneArg) => {
        this.selectedAppoitment.set(eventResizeArg.oldEvent as EventInput);
        this.selectedSlot.set(eventResizeArg.event as EventInput);
    };
    onDrop = (eventDropArg: EventDropArg) => {
        this.selectedSlot.set({
            start: eventDropArg.event.start as Date,
            end: eventDropArg.event.end as Date
        });
        this.selectedAppoitment.set(eventDropArg.oldEvent as EventInput);
    };
    onDateSelect = (selectionInfo: DateSelectArg) => {
        this.selectedSlot.set({ start: selectionInfo.start, end: selectionInfo.end });
        this.showCreateAppointmentModal.set(true);
    };
    canStartDrag = (selectionInfo: any) => {
        return selectionInfo.start > new Date();
    };

    loadSlot() {
        this.slotService.getSlotByCreator(this.userConnected().id, this.dateStart, this.dateEnd).subscribe();
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

        events: this.events,
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
    onDeleteAppointmentReservation(shouldRelaod: boolean = false) {
        shouldRelaod && this.loadSlot();
    }
    onUpdateAppointment(shouldRelaod: boolean = false) {
        shouldRelaod && this.loadSlot();
    }
}
