import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
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
export class CalendarForTeacherComponent implements OnInit, AfterViewInit {
    slotService = inject(SlotService);
    visibleEvents = this.slotService.visibleEvents; // signal
    userConnected = inject(AuthService).userConnected; // signal

    isVisibleModalCreate: boolean = false;
    isVisibleModalUpdate: boolean = false;
    isVisibleModalDelete: boolean = false;

    @ViewChild('calendar')
    calendarComponent!: FullCalendarComponent;
    events: EventInput[] = [];
    displayModal: boolean = false;
    dateStart!: string;
    dateEnd!: string;
    currentDate!: Date;
    selectedSlot: EventInput = { start: new Date(), end: new Date() }; // empty slot selected pas un appoitment
    selectedAppoitment: EventInput = { start: new Date(), end: new Date() }; // evenement déjà créé
    isModalCreate: boolean = false;

    canDrop = (dropInfo: any, draggedEvent: any) => {
        const now = new Date();
        return dropInfo.start >= now && draggedEvent.start >= now;
    };
    onEventClick = (eventClickArg: EventClickArg) => {
        this.isModalCreate = false;
        this.selectedAppoitment = eventClickArg.event as EventInput;
        this.selectedSlot = eventClickArg.event as EventInput;
        // if (this.selectedAppoitment?.start! < new Date()) return;
        this.slotService.selectedEvent.set(this.selectedAppoitment);
        this.isVisibleModalDelete = true;
    };
    onResize = (eventResizeArg: EventResizeDoneArg) => {
        this.isModalCreate = false;
        this.selectedAppoitment = eventResizeArg.oldEvent as EventInput;
        this.selectedSlot = eventResizeArg.event as EventInput;
        this.isVisibleModalDelete = true;
        // this.isVisibleModalUpdate = true;
    };
    onDrop = (eventDropArg: EventDropArg) => {
        this.isModalCreate = false;
        this.selectedSlot = {
            start: eventDropArg.event.start as Date,
            end: eventDropArg.event.end as Date
        };
        this.selectedAppoitment = eventDropArg.oldEvent as EventInput;
        this.isVisibleModalDelete = true;
        // this.isVisibleModalUpdate = true;
    };
    onDateSelect = (selectionInfo: DateSelectArg) => {
        this.selectedSlot = { start: selectionInfo.start, end: selectionInfo.end };
        this.showCreateModal();
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

    showCreateModal() {
        // this.isVisibleModalCreate = true;
        this.isModalCreate = true;
        this.isVisibleModalDelete = true;
    }
    hideCreateModal() {
        // this.isVisibleModalCreate = false;
        this.isModalCreate = false;
        this.isVisibleModalDelete = false;
    }
    async ngOnInit(): Promise<void> {}

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
        this.isVisibleModalCreate = false;
        this.isVisibleModalUpdate = false;
        this.isVisibleModalDelete = false;
        shouldRelaod && this.loadSlot();
    }
    onUpdateAppointment(shouldRelaod: boolean = false) {
        this.isVisibleModalCreate = false;
        this.isVisibleModalUpdate = false;
        this.isVisibleModalDelete = false;
        shouldRelaod && this.loadSlot();
    }
}
