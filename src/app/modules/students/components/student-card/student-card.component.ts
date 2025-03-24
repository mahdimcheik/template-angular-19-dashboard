import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserResponseDTO } from '../../../../shared/models/user';
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-student-card',
    imports: [CardModule, ButtonModule, TitleCasePipe],
    templateUrl: './student-card.component.html',
    styleUrl: './student-card.component.scss'
})
export class StudentCardComponent {
    student = input({} as UserResponseDTO);
}
