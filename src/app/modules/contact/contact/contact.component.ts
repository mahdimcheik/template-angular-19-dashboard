import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../../shared/services/auth.service';
import { max } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'app-contact',
    imports: [DropdownModule, CheckboxModule, FormsModule, ReactiveFormsModule, TextareaModule, InputTextModule, ButtonModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
    userService = inject(AuthService);
    subjectOptions: string[] = ['Demande de renseignements', 'Demande de remboursements', 'Proposition', 'Autre'];
    userForm!: FormGroup;

    ngOnInit(): void {
        const user = this.userService.userConnected();
        this.userForm = new FormGroup({
            userId: new FormControl<string>(user.id),
            email: new FormControl<string>(user.email),
            subject: new FormControl<string>('Autre'),
            message: new FormControl<string>('', [Validators.required, Validators.maxLength(500)]),
            sendtoSender: new FormControl<boolean>(false)
        });
    }

    onSubmit(form: any) {}
}
