import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { UserResponseDTO } from '../../../../shared/models/user';
import { UserMainService } from '../../../../shared/services/userMain.service';
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
    authService = inject(UserMainService);
    cursusService = inject(CursusService);
    ngOnInit(): void {
        (this.authService as any).getTeacherProfile().subscribe((res: any) => {
            this.teacherProfile.set(res.data as UserResponseDTO);
        });
    }
}
