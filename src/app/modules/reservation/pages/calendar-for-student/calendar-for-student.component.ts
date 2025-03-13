import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventContentArg, EventDropArg, EventInput } from '@fullcalendar/core/index.js';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin, { EventResizeDoneArg, EventResizeStopArg } from '@fullcalendar/interaction';
import { SlotService } from '../../../../shared/services/slot.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';
import { ModalBookOrUnbookComponent } from '../../components/modal-book-or-unbook/modal-book-or-unbook.component';

type MinimalEvent = {
    start: Date;
    end: Date;
};
type CustomEvent = {
    start: Date;
    end: Date;
    extendedProps: {
        id: string;
        firstName: string;
        lastName: string;
        imgUrl: string;
    };
};

@Component({
    selector: 'app-calendar-for-student',
    imports: [ButtonModule, FullCalendarModule, CommonModule, HelpTypePipe, ModalBookOrUnbookComponent],

    templateUrl: './calendar-for-student.component.html',
    styleUrl: './calendar-for-student.component.scss'
})
export class CalendarForStudentComponent implements OnInit, AfterViewInit {
    slotService = inject(SlotService);
    visibleEvents = this.slotService.visibleEvents; // signal
    userConnected = inject(AuthService).userConnected; // signal

    isVisibleModalBookDelete: boolean = false;

    @ViewChild('calendar')
    calendarComponent!: FullCalendarComponent;
    events: EventInput[] = [];
    dateStart!: string;
    dateEnd!: string;
    currentDate!: Date;
    selectedSlot: EventInput = { start: new Date(), end: new Date() }; // empty slot selected pas un appoitment
    selectedAppoitment: EventInput = { start: new Date(), end: new Date() }; // evenement déjà créé
    visibleModalBookUnbook = signal<boolean>(false);

    canDrop = (dropInfo: any, draggedEvent: any) => {
        return false;
    };
    onEventClick = (eventClickArg: EventClickArg) => {
        this.selectedAppoitment = eventClickArg.event as EventInput;
        this.slotService.selectedEvent.set(this.selectedAppoitment);
        this.visibleModalBookUnbook.set(true);
    };
    onResize = (eventResizeArg: EventResizeDoneArg) => {};
    onDrop = (eventDropArg: EventDropArg) => {};
    onDateSelect = (selectionInfo: DateSelectArg) => {};
    canStartDrag = (selectionInfo: any) => {
        return false;
    };
    loadSlot() {
        this.slotService.getSlotByStudent(this.dateStart, this.dateEnd).subscribe();
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
        // eventContent: this.renderEventContent, // template appoitment
        select: this.onDateSelect,
        eventClick: this.onEventClick,
        // drag and drop
        selectAllow: this.canStartDrag, // can start drag event ?
        eventAllow: this.canDrop, // can drop ?
        eventDrop: this.onDrop, // drop

        events: this.events,
        eventColor: '#0000'
    };

    async ngOnInit(): Promise<void> {
        // this.loadSlot();
    }

    ngAfterViewInit(): void {
        const calendarApi = this.calendarComponent.getApi();
        this.dateStart = calendarApi.view.currentStart.toUTCString();
        this.dateEnd = calendarApi.view.currentEnd.toUTCString();
        this.currentDate = calendarApi.getDate();
        this.loadSlot();
    }
    // manually add buttons controlling the calendar
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

    // react on modals
    onModalAction(e: any) {
        this.isVisibleModalBookDelete = false;
        this.loadSlot();
    }
}
