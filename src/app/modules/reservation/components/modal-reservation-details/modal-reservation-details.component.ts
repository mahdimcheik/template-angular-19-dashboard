import { Component, computed, inject, input, model, output, signal, OnInit, effect } from '@angular/core';
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
import { finalize, firstValueFrom } from 'rxjs';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';

@Component({
    selector: 'app-modal-reservation-details',
    standalone: true,
    imports: [CommonModule, DrawerModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, FormsModule, DatePipe, HelpTypePipe],
    templateUrl: './modal-reservation-details.component.html',
    styleUrl: './modal-reservation-details.component.scss'
})
export class ModalReservationDetailsComponent implements OnInit {
    private slotService = inject(SlotMainService);
    private messageService = inject(MessageService);
    authService = inject(UserMainService);

    visibleRight = model<boolean>(false);
    reservation = input.required<BookingResponseDTO>();
    onClose = output<boolean>();

    // Chat functionality
    messages = signal<ChatMessage[]>([]);
    newMessage = signal<string>('');
    isLoadingMessages = signal<boolean>(false);
    isSendingMessage = signal<boolean>(false);

    ngOnInit() {
        // Watch for modal visibility changes to load messages
        effect(() => {
            if (this.visibleRight() && this.reservation().id) {
                this.loadMessages();
            }
        });
    }

    async loadMessages() {
        const reservationId = this.reservation().id;
        if (!reservationId) return;

        this.isLoadingMessages.set(true);
        try {
            const messages = await firstValueFrom(this.slotService.getMessages(reservationId));
            this.messages.set(messages || []);
        } catch (error) {
            console.error('Error loading messages:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de charger les messages'
            });
        } finally {
            this.isLoadingMessages.set(false);
        }
    }

    close() {
        this.visibleRight.set(false);
        this.onClose.emit(false);
        // Reset chat state when closing
        this.messages.set([]);
        this.newMessage.set('');
    }

    formatDateTime(dateString: string | undefined): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    calculateDuration(startAt: string | undefined, endAt: string | undefined): string {
        if (!startAt || !endAt) return 'N/A';

        const start = new Date(startAt);
        const end = new Date(endAt);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 0) {
            return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}min` : `${diffHours}h`;
        }
        return `${diffMinutes}min`;
    }

    viewCommunications() {
        // This method is now replaced by sendMessage functionality
        this.sendMessage();
    }

    async sendMessage() {
        const messageText = this.newMessage().trim();
        const reservationId = this.reservation().id;

        if (!messageText || !reservationId) return;

        this.isSendingMessage.set(true);
        try {
            const currentUser = (this.authService as any).userConnected();
            const message: ChatMessage = {
                message: messageText,
                author: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'Utilisateur',
                date: new Date().toISOString()
            };

            const success = await firstValueFrom(this.slotService.addMessage(reservationId, message));

            if (success) {
                this.messages.update((messages) => [...messages, message]);
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
        } finally {
            this.isSendingMessage.set(false);
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
