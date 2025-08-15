import { Component, computed, inject, input, model, output, signal, OnInit, effect, linkedSignal, DestroyRef, AfterViewChecked, viewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { BookingResponseDTO } from '../../../../api/models/BookingResponseDTO';
import { EnumTypeHelp } from '../../../../api/models/EnumTypeHelp';
import { ChatMessage } from '../../../../api/models/ChatMessage';
import { SlotMainService } from '../../../../shared/services/slotMain.service';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { finalize, firstValueFrom, interval } from 'rxjs';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';
import { LoaderService } from '../../../../shared/services/loader.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-modal-reservation-details',
    standalone: true,
    imports: [CommonModule, DrawerModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, FormsModule, DatePipe, HelpTypePipe],
    templateUrl: './modal-reservation-details.component.html',
    styleUrl: './modal-reservation-details.component.scss'
})
export class ModalReservationDetailsComponent implements AfterViewInit {
    private slotService = inject(SlotMainService);
    private messageService = inject(MessageService);
    authService = inject(UserMainService);
    isLoading = inject(LoaderService).isLoading;
    destroyRef = inject(DestroyRef);

    visibleRight = model<boolean>(false);
    reservation = input.required<BookingResponseDTO>();
    onClose = output<boolean>();

    messageContainer = viewChild<ElementRef<HTMLDivElement>>('messagesContainer');

    // Chat functionality
    messages = linkedSignal<ChatMessage[]>(() => {
        return this.reservation() && this.reservation().communications ? this.reservation()!.communications! : [];
    });
    newMessage = signal<string>('');

    durationComputed = computed(() => {
        const start = this.reservation().startAt;
        const end = this.reservation().endAt;
        if (!start || !end) return 'N/A';

        const diffMs = new Date(end).getTime() - new Date(start).getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 0) {
            return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}min` : `${diffHours}h`;
        }
        return `${diffMinutes}min`;
    });

    /**
     *
     */
    constructor() {
        effect(() => {
            const reservation = this.reservation();
            this.loadMessages();
        });

        interval(5000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.loadMessages();
            });
    }
    ngAfterViewInit(): void {
        const elementRef = this.messageContainer();
        setTimeout(() => {
            elementRef!.nativeElement.scrollTop = elementRef!.nativeElement.scrollHeight;
        });
    }

    async loadMessages() {
        const reservationId = this.reservation().id;
        if (!reservationId) return;
        try {
            const messages = await firstValueFrom(this.slotService.getMessages(reservationId));
            if (messages) {
                this.messages.set([...messages]);
            }
            console.log('Messages loaded:', messages);
        } catch (error) {
            console.error('Error loading messages:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de charger les messages'
            });
        } finally {
        }
    }

    close() {
        this.visibleRight.set(false);
        this.onClose.emit(false);
        // Reset chat state when closing
        this.messages.set([]);
        this.newMessage.set('');
    }

    async sendMessage() {
        const messageText = this.newMessage().trim();
        const reservationId = this.reservation().id;

        if (!messageText || !reservationId) return;

        try {
            const currentUser = (this.authService as any).userConnected();
            const message: ChatMessage = {
                message: messageText,
                author: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'Utilisateur',
                date: new Date().toISOString()
            };

            const success = await firstValueFrom(this.slotService.addMessage(reservationId, message));
            await this.loadMessages();

            if (success) {
                this.newMessage.set('');
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Message envoyé avec succès'
                });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Impossible d'envoyer le message"
            });
        }
    }

    isCurrentUserMessage(message: ChatMessage): boolean {
        const currentUser = this.authService.userConnected();
        return currentUser.id === message.userId;
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            this.sendMessage();
        }
    }
}
