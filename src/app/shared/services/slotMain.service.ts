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

/**
 * Type aliases pour la compatibilité ascendante.
 */
export type { SlotResponseDTO, SlotCreateDTO, SlotUpdateDTO, BookingCreateDTO, BookingResponseDTO, ChatMessage };
export type QueryPanigation = QueryPagination;
/**
 * Service pour gérer les créneaux et les réservations.
 * Fournit des méthodes pour récupérer, ajouter, mettre à jour et supprimer des créneaux, ainsi que pour gérer les réservations et les communications via l'API.
 * Utilise SlotService et BookingService générés par OpenAPI pour les appels API.
 * Stocke les créneaux visibles, les réservations et leur nombre dans des signaux pour une réactivité facile dans les composants Angular.
 * Fournit également des méthodes de communication pour récupérer et envoyer des messages liés aux réservations.
 * Utilise FullCalendar pour la gestion des événements de calendrier.
 */
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

    /**
     * Récupère un créneau par son ID.
     * @param slotId ID du créneau à récupérer
     * @returns Un observable contenant le créneau correspondant
     */
    getSlotById(slotId: string): Observable<EventInput> {
        return this.generatedSlotService.getSlotSlotid(slotId).pipe(
            map((response) => {
                const slot = response.data as SlotResponseDTO;
                return this.convertSlotResponseToEventInput(slot);
            })
        );
    }

    /**
     * Récupère les créneaux d'un utilisateur par son ID.
     * @param userId ID de l'utilisateur
     * @param fromDate Date de début de la plage de recherche
     * @param toDate Date de fin de la plage de recherche
     * @returns Un observable contenant la liste des créneaux correspondants
     */
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

    /**
     * Ajoute un créneau par le créateur.
     * Met à jour le signal visibleEvents avec le nouveau créneau ajouté.
     * @param slotCreateDTO Les données du créneau à ajouter
     * @returns Un observable contenant la réponse de l'API
     */
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

    /**
     * Met à jour un créneau par le créateur.
     * @param slotUpdateDTO Les données du créneau à mettre à jour
     * @returns Un observable contenant la réponse de l'API
     */
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

    /**
     * Supprime un créneau par le créateur.
     * @param slotId ID du créneau à supprimer
     * @returns Un observable contenant la réponse de l'API
     */
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

    /**
     * Annule une réservation par le professeur.
     * @param slotId ID du créneau à annuler par le professeur
     * @returns Un observable contenant la réponse de l'API
     */
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

    /**
     * Récupère les créneaux disponibles pour un étudiant.
     * @param fromDate Date de début de la plage de dates
     * @param toDate Date de fin de la plage de dates
     * @returns Un observable contenant la liste des créneaux disponibles
     */
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

    /**
     * Réserve un créneau.
     * @param newBooking Les données de la réservation à créer
     * @returns Un observable contenant la réponse de l'API
     */
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

    /**
     * Annule une réservation par l'étudiant.
     * @param slotId ID du créneau à annuler par l'étudiant
     * @returns Un observable contenant la réponse de l'API
     */
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

    /**
     * Récupère les réservations d'un étudiant.
     * @param query Les paramètres de pagination pour la requête
     * @returns Un observable contenant la réponse de l'API
     */
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

    /**
     * Récupère les réservations d'un professeur.
     * @param query Les paramètres de pagination pour la requête
     * @returns Un observable contenant la réponse de l'API
     */
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

    /**
     * Récupère les messages d'une réservation (suivi de cours/discussions).
     * @param bookingId ID de la réservation pour laquelle on veut les messages
     * @returns Un observable contenant la liste des messages
     */
    getMessages(bookingId: string): Observable<ChatMessage[]> {
        return this.generatedBookingService.getBookingCommunications(bookingId).pipe(map((messages) => messages.data || []));
    }

    /**
     * Ajoute un message à une réservation (suivi de cours/discussions).
     * @param bookingId ID de la réservation à laquelle on veut ajouter un message
     * @param message Le message à ajouter
     * @returns Un observable contenant le statut de l'opération
     */
    addMessage(bookingId: string, message: ChatMessage): Observable<boolean> {
        return this.generatedBookingService.postBookingCommunicationsAddMessage(bookingId, message).pipe(map((response) => response || false));
    }

   /**
    * Convertit un créneau de réservation en entrée d'événement.
    * pour fullCalendar
    * @param slot Le créneau à convertir
    * @returns 
    */
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
