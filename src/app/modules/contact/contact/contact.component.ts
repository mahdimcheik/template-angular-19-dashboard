import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../../shared/services/auth.service';
import { finalize, max } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ImageModule } from 'primeng/image';
import { MailMainService } from '../../../shared/services/mailMain.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-contact',
    imports: [DropdownModule, CheckboxModule, FormsModule, ReactiveFormsModule, TextareaModule, InputTextModule, ButtonModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
    mailService = inject(MailMainService);
    router = inject(Router);
    messageService = inject(MessageService);

    subjectOptions: string[] = ['Demande de renseignements', 'Demande de remboursements', 'Proposition', 'Autre'];
    userForm!: FormGroup;

    ngOnInit(): void {
        this.userForm = new FormGroup({
            mailSubject: new FormControl<string>('Autre'),
            mailBody: new FormControl<string>('', [Validators.required, Validators.maxLength(500)]),
            sendtoSender: new FormControl<boolean>(false)
        });
    }

    onSubmit() {
        this.mailService.sendEmail(this.userForm.value).subscribe((res) => {
            this.userForm.reset();
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Votre message a été envoyé avec succès !'
            });
            this.router.navigate(['/']);
        });
    }
}
