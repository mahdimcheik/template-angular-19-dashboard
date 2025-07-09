import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, model, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { UserResponseDTO } from '../../../../shared/services/userMain.service';
import { AvatarModule } from 'primeng/avatar';
import { DobToAgePipe } from '../../../../shared/pipes/dob-to-age.pipe';
import { AdminMainService } from '../../../../shared/services/adminMain.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'app-modal-edit-user-by-admin',
    imports: [InputTextModule, AvatarModule, DobToAgePipe, TextareaModule, MessageModule, ButtonModule, FluidModule, SelectModule, CommonModule, ReactiveFormsModule, DialogModule, ImageModule],
    templateUrl: './modal-edit-user-by-admin.component.html',
    styleUrl: './modal-edit-user-by-admin.component.scss'
})
export class ModalEditUserByAdminComponent {
    visible = model<boolean>(false);
    onUpdate = output<UserResponseDTO>();
    user = input.required<UserResponseDTO>();
    isBanned = computed(() => (this.user()?.isBanned ? `est banni(e) jusqu\'au` : ''));

    adminService = inject(AdminMainService);
    router = inject(Router);

    banUnbanUser() {
        this.adminService
            .banUnbanUser({ userId: this.user().id ?? '', isBanned: !this.user().isBanned })
            .pipe(
                finalize(() => {
                    console.log('banUnbanUser: finalize');

                    this.visible.set(false);
                })
            )
            .subscribe((res) => {
                console.log(res.data);
                this.onUpdate.emit(res.data);
            });
    }

    showProfil(id: string) {
        this.visible.set(false);
        this.router.navigate(['dashboard/profile/user', id]);
    }
}
