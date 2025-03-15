import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PersonnalInfosComponent } from '../../components/personnal-infos/personnal-infos.component';
import { UserResponseDTO } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
    selector: 'app-teacher-public-profile',
    imports: [CommonModule, ButtonModule, DividerModule, PersonnalInfosComponent],
    templateUrl: './teacher-public-profile.component.html',
    styleUrl: './teacher-public-profile.component.scss'
})
export class TeacherPublicProfileComponent implements OnInit {
    teacherProfile!: UserResponseDTO;
    authService = inject(AuthService);
    ngOnInit(): void {
        this.authService.getTeacherProfile().subscribe((res) => {
            this.teacherProfile = res.data as UserResponseDTO;
        });
    }
}
