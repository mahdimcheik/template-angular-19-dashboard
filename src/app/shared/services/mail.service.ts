import { inject, Injectable } from '@angular/core';
import { Email } from '../models/email';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class MailService {
    Httpclient = inject(HttpClient);

    constructor() {}
    /**
     * Send an email to the admin
     * @param Email
     * @returns Observable<Email>
     */
    sendEmail(Email: Email) {
        return this.Httpclient.post<Email>(environment.BACK_URL + 'mail/contact-admin', Email);
    }
}
