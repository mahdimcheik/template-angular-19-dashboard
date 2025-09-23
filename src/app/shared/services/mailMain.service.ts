import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MailService as GeneratedMailService } from '../../api/services/MailService';
import { Mail } from '../../api/models/Mail';

// Type aliases for backward compatibility
/**
 * Alias de type pour Mail, utilisé pour la compatibilité ascendante.
 */
export type Email = Mail;
/**
 * Service pour gérer l'envoi d'emails.
 * Fournit une méthode pour envoyer des emails via l'API.
 * Utilise MailService généré par OpenAPI pour les appels API.
 */
@Injectable({
    providedIn: 'root'
})
export class MailMainService {
    private generatedMailService = inject(GeneratedMailService);
/**
 * Envoie un email.
 * @param email Les données de l'email à envoyer
 * @returns Un observable contenant la réponse de l'API
 */
    sendEmail(email: Email): Observable<Mail> {
        return this.generatedMailService.postMailContactAdmin(email);
    }
}
