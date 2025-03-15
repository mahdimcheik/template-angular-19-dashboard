import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { UserResponseDTO } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';
import { ProfileComponent } from '../../../../modules/profile/pages/profile/profile.component';

@Component({
    selector: 'app-teacher-public-profile',
    imports: [CommonModule, ButtonModule, DividerModule, ProfileComponent, ProfileComponent],
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
