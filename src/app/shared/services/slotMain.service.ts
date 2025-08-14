import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { EventInput } from '@fullcalendar/core/index.js';
import { SlotService as GeneratedSlotService } from '../../api/services/SlotService';
import { BookingService as GeneratedBookingService } from '../../api/services/BookingService';
import { SlotResponseDTO } from '../../api/models/SlotResponseDTO';
import { SlotCreateDTO } from '../../api/models/SlotCreateDTO';
import { SlotUpdateDTO } from '../../api/models/SlotUpdateDTO';
import { BookingCreateDTO } from '../../api/models/BookingCreateDTO';
import { BookingResponseDTO } from '../../api/models/BookingResponseDTO';
import { QueryPagination } from '../../api/models/QueryPagination';
import { ChatMessage } from '../../api/models/ChatMessage';

// Type aliases for backward compatibility
export type { SlotResponseDTO, SlotCreateDTO, SlotUpdateDTO, BookingCreateDTO, BookingResponseDTO, ChatMessage };
export type QueryPanigation = QueryPagination;

@Injectable({
    providedIn: 'root'
})
export class SlotMainService {
    private generatedSlotService = inject(GeneratedSlotService);
    private generatedBookingService = inject(GeneratedBookingService);

    visibleEvents = signal([] as EventInput[]);
    bookings = signal([] as BookingResponseDTO[]);
    totalReservations = signal(0);
    selectedEvent = signal({} as EventInput);
    start = signal(new Date());
    end = signal(new Date());

    getSlotById(slotId: string): Observable<EventInput> {
        return this.generatedSlotService.getSlotSlotid(slotId).pipe(
            map((response) => {
                const slot = response.data as SlotResponseDTO;
                return this.convertSlotResponseToEventInput(slot);
            })
        );
    }

    getSlotByCreator(userId: string, fromDate: string, toDate: string): Observable<EventInput[]> {
        return this.generatedSlotService.getSlot(userId, fromDate, toDate).pipe(
            map((response) => {
                const slots = response.data as SlotResponseDTO[];
                if (!slots || slots.length === 0) return [];
                return slots.map((slot) => this.convertSlotResponseToEventInput(slot));
            }),
            tap((res) => this.visibleEvents.set(res))
        );
    }

    addSlotByCreator(slotCreateDTO: SlotCreateDTO) {
        return this.generatedSlotService.postSlot(slotCreateDTO).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || {},
                count: response.count || 0
            })),
            tap((res) => {
                this.visibleEvents().push(this.convertSlotResponseToEventInput(res.data as SlotResponseDTO));
                this.visibleEvents.set([...this.visibleEvents()]);
            })
        );
    }

    updateSlotByCreator(slotUpdateDTO: SlotUpdateDTO) {
        return this.generatedSlotService.putSlot(slotUpdateDTO).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || {},
                count: response.count || 0
            })),
            tap((res) => {
                let relatedAppointmentIndex = this.visibleEvents().findIndex((x) => x.extendedProps?.['id'] == slotUpdateDTO.id);
                if (relatedAppointmentIndex !== -1) {
                    this.visibleEvents()[relatedAppointmentIndex] = this.convertSlotResponseToEventInput(res.data as SlotResponseDTO);
                }
                this.visibleEvents.set([...this.visibleEvents()]);
            })
        );
    }

    deleteSlotByCreator(slotId: string) {
        return this.generatedSlotService.deleteSlot(slotId).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || {},
                count: response.count || 0
            }))
        );
    }

    unbookReservationByTeacher(slotId: string) {
        return this.generatedBookingService.deleteBookingUnbook(slotId).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || {},
                count: response.count || 0
            })),
            tap(() => {
                let relatedAppointmentIndex = this.visibleEvents().findIndex((x) => x.extendedProps?.['id'] == slotId);
                if (relatedAppointmentIndex !== -1) {
                    this.visibleEvents()[relatedAppointmentIndex] = {
                        ...this.visibleEvents()[relatedAppointmentIndex],
                        extendedProps: { id: slotId }
                    } as EventInput;
                }
                this.visibleEvents.set([...this.visibleEvents()]);
            })
        );
    }

    getSlotByStudent(fromDate: string, toDate: string): Observable<EventInput[]> {
        return this.generatedSlotService.getSlotStudent(fromDate, toDate).pipe(
            map((response) => {
                const slots = response.data as SlotResponseDTO[];
                this.totalReservations.set(response.count ?? 0);
                if (!slots || slots.length === 0) return [];
                return slots.map((slot) => this.convertSlotResponseToEventInput(slot));
            }),
            tap((res) => {
                this.visibleEvents.set(res);
            })
        );
    }

    bookSlot(newBooking: BookingCreateDTO) {
        return this.generatedBookingService.postBookingBook(newBooking).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || {},
                count: response.count || 0
            }))
        );
    }

    unbookReservationByStudent(slotId: string) {
        return this.generatedBookingService.deleteBookingStudentUnbook(slotId).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || {},
                count: response.count || 0
            }))
        );
    }

    getReservationsByStudent(query: QueryPagination) {
        return this.generatedBookingService.postBookingReservationsStudent(query).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || [],
                count: response.count || 0
            })),
            tap((res) => {
                this.bookings.set(res.data as BookingResponseDTO[]);
                this.totalReservations.set(res.count ?? 0);
            })
        );
    }

    getReservationsByTeacher(query: QueryPagination) {
        return this.generatedBookingService.postBookingReservationsTeacher(query).pipe(
            map((response) => ({
                message: response.message || 'Success',
                status: response.status || 200,
                data: response.data || [],
                count: response.count || 0
            })),
            tap((res) => {
                this.bookings.set(res.data as BookingResponseDTO[]);
                this.totalReservations.set(res.count ?? 0);
            })
        );
    }

    // Communication methods
    getMessages(bookingId: string): Observable<ChatMessage[]> {
        return this.generatedBookingService.getBookingCommunications(bookingId).pipe(map((messages) => messages || []));
    }

    addMessage(bookingId: string, message: ChatMessage): Observable<boolean> {
        return this.generatedBookingService.postBookingCommunicationsAddMessage(bookingId, message).pipe(map((response) => response || false));
    }

    // Helper method to convert SlotResponseDTO to EventInput
    convertSlotResponseToEventInput(slot: SlotResponseDTO): EventInput {
        return {
            start: new Date(slot.startAt!),
            end: new Date(slot.endAt!),
            title: slot.subject ?? 'Rendez-vous',
            id: slot.id,
            extendedProps: {
                slot: slot
            }
        };
    }
}
