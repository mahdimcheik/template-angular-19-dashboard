import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { UserResponseDTO } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';
import { ImageModule } from 'primeng/image';
import { CursusService } from '../../../../shared/services/cursus.service';
import { CursusListComponent } from '../../../../modules/cursus/components/cursus-list/cursus-list.component';

@Component({
    selector: 'app-teacher-public-profile',
    imports: [CommonModule, ButtonModule, DividerModule, ImageModule, CursusListComponent],
    templateUrl: './teacher-public-profile.component.html',
    styleUrl: './teacher-public-profile.component.scss'
})
export class TeacherPublicProfileComponent implements OnInit {
    teacherProfile = signal<UserResponseDTO>({} as UserResponseDTO);
    authService = inject(AuthService);
    cursusService = inject(CursusService);
    ngOnInit(): void {
        this.authService.getTeacherProfile().subscribe((res) => {
            this.teacherProfile.set(res.data as UserResponseDTO);
        });
    }
}
