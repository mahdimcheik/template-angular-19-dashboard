import { inject, Injectable } from '@angular/core';
import { Email } from '../../api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class MailService {
    Httpclient = inject(HttpClient);
    sendEmail(Email: Email) {
        return this.Httpclient.post<Email>(environment.BACK_URL + '/mail/contact-admin', Email);
    }
}
