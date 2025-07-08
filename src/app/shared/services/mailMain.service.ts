import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MailService as GeneratedMailService } from '../../api/services/MailService';
import { Mail } from '../../api/models/Mail';

// Type aliases for backward compatibility
export type Email = Mail;

@Injectable({
    providedIn: 'root'
})
export class MailMainService {
    private generatedMailService = inject(GeneratedMailService);

    sendEmail(email: Email): Observable<Mail> {
        return this.generatedMailService.postMailContactAdmin(email);
    }
}
