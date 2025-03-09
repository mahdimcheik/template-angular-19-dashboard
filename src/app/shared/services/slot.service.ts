import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { identity, map, Observable, of, switchMap, tap } from 'rxjs';
import { EventInput } from '@fullcalendar/core/index.js';
import { ResponseDTO } from '../models/user';
import { BookingCreateDTO, QueryPanigation, BookingResponseDTO, SlotCreateDTO, SlotResponseDTO, SlotUpdateDTO } from '../models/slot';

@Injectable({
    providedIn: 'root'
})
export class SlotService {
    visibleEvents = signal([] as EventInput[]);
    bookings = signal([] as BookingResponseDTO[]);
    totalReservations = signal(0);
    selectedEvent = signal({} as EventInput);
    start = signal(new Date());
    end = signal(new Date());
    private http = inject(HttpClient);

    constructor() {}

    getSlotById(slotId: string): Observable<EventInput> {
        return this.http.get<ResponseDTO>(`https://localhost:7113/slot/slotid/${slotId}`).pipe(map((res) => this.convertSlotResponseToEventInput(res.data as SlotResponseDTO)));
    }

    getSlotByCreator(userId: string, fromDate: string, toDate: string): Observable<EventInput[]> {
        return this.http.get<ResponseDTO>(`https://localhost:7113/slot?userId=${userId}&fromDate=${fromDate}&toDate=${toDate}`).pipe(
            map((res) => {
                var slots = res.data as SlotResponseDTO[];
                if (slots == null || slots.length == 0) return [];
                return slots.map((slot) => this.convertSlotResponseToEventInput(slot));
            }),
            tap((res) => this.visibleEvents.set(res))
        );
    }

    addSlotByCreator(slotCreateDTO: SlotCreateDTO): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`https://localhost:7113/slot`, slotCreateDTO).pipe(
            tap((res) => {
                this.visibleEvents().push(this.convertSlotResponseToEventInput(res.data));
                this.visibleEvents.set([...this.visibleEvents()]);
            })
        );
    }

    updateSlotByCreator(slotUpdateDTO: SlotUpdateDTO): Observable<ResponseDTO> {
        return this.http.put<ResponseDTO>(`https://localhost:7113/slot`, slotUpdateDTO).pipe(
            tap((res) => {
                let relatedAppointmentIndex = this.visibleEvents().findIndex((x) => x.extendedProps?.['id'] == slotUpdateDTO.id);

                if (relatedAppointmentIndex != null) {
                    this.visibleEvents()[relatedAppointmentIndex] = this.convertSlotResponseToEventInput(res.data);
                }

                this.visibleEvents.set([...this.visibleEvents()]);
                // this.visibleEvents.update(this.visibleEvents);
            })
        );
    }

    deleteSlotByCreator(slotId: string): Observable<ResponseDTO> {
        return this.http.delete<ResponseDTO>(`https://localhost:7113/slot?slotId=${slotId}`);
    }

    unbookReservationByTeacher(slotId: string): Observable<ResponseDTO> {
        return this.http.delete<ResponseDTO>(`https://localhost:7113/booking/unbook?slotId=${slotId}`).pipe(
            tap(() => {
                let relatedAppointmentIndex = this.visibleEvents().findIndex((x) => x.extendedProps?.['id'] == slotId);

                if (relatedAppointmentIndex != null) {
                    this.visibleEvents()[relatedAppointmentIndex] = {
                        ...this.visibleEvents()[relatedAppointmentIndex],
                        extendedProps: { id: slotId }
                    } as EventInput;
                }

                this.visibleEvents.set([...this.visibleEvents()]);
            })
        );
    }

    // student reservations
    getSlotByStudent(fromDate: string, toDate: string): Observable<EventInput[]> {
        return this.http.get<ResponseDTO>(`https://localhost:7113/slot/student?fromDate=${fromDate}&toDate=${toDate}`).pipe(
            map((res) => {
                var slots = res.data as SlotResponseDTO[];
                this.totalReservations.set(res.count ?? 0);
                if (slots == null || slots.length == 0) return [];
                return slots.map((slot) => this.convertSlotResponseToEventInput(slot));
            }),
            tap((res) => {
                this.visibleEvents.set(res);
                console.log('events : ', res);
            })
        );
    }

    bookSlot(newBooking: BookingCreateDTO): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`https://localhost:7113/booking/book`, newBooking);
    }

    unbookReservationByStudent(slotId: string): Observable<ResponseDTO> {
        return this.http.delete<ResponseDTO>(`https://localhost:7113/booking/student/unbook?slotId=${slotId}`);
    }
    // extensions
    convertSlotResponseToEventInput(slot: SlotResponseDTO) {
        return {
            start: new Date(slot.startAt),
            end: new Date(slot.endAt),
            title: slot.subject ?? 'Rendez-vous',
            id: slot.id,
            extendedProps: {
                slot: slot
            }
        };
    }

    // get reservations
    getReservationsByStudent(query: QueryPanigation): Observable<BookingResponseDTO[]> {
        return this.http.post<ResponseDTO>(`https://localhost:7113/booking/reservations-student`, query).pipe(
            map((res) => {
                var reservations = res.data as BookingResponseDTO[];
                if (reservations == null || reservations.length == 0) return [];
                return reservations;
            }),
            tap((res) => {
                this.bookings.set(res);
                console.log('reservations : ', res);
            })
        );
    }

    getReservationsByTeacher(query: QueryPanigation): Observable<ResponseDTO> {
        return this.http.post<ResponseDTO>(`https://localhost:7113/booking/reservations-teacher`, query);
    }
}
