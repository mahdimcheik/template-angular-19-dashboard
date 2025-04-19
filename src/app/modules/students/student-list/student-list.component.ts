import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AdminService } from '../../../shared/services/admin.service';
import { PaginatorModule } from 'primeng/paginator';
import { UserResponseDTO } from '../../../shared/models/user';
import { Router } from '@angular/router';
import { ModalEditUserByAdminComponent } from '../components/modal-edit-user-by-admin/modal-edit-user-by-admin.component';

@Component({
    selector: 'app-student-list',
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule, PaginatorModule, ModalEditUserByAdminComponent],

    templateUrl: './student-list.component.html',
    styleUrl: './student-list.component.scss'
})
export class StudentListComponent {
    layout: 'list' | 'grid' = 'list';

    options = ['list', 'grid'];

    router = inject(Router);
    adminService = inject(AdminService);
    students = signal<UserResponseDTO[]>([]);

    count = 0;

    first = 0;
    rows = 10;

    // region modal edit user by admin
    student!: UserResponseDTO;
    showModal = signal<boolean>(false);

    ngOnInit() {
        this.adminService.getAllStudents(this.first, this.rows).subscribe((res) => {
            this.students.set(res.data);
            this.count = res.count ?? 0;
        });
    }
    loadStudentsList(e: any) {
        this.adminService.getAllStudents(e.first, this.rows).subscribe((res) => {
            this.students.set(res.data);
        });
    }
    onUpdate(e: UserResponseDTO) {
        const index = this.students().findIndex((u) => u.id === e.id);
        if (index !== -1) {
            this.students()[index] = e;
            this.students.update(() => [...this.students()]);
        }
    }

    showProfil(id: string) {
        this.router.navigateByUrl(`dashboard/profile/user/${id}`);
    }

    showMore(item: string) {
        const user = this.students().find((u) => u.id === item);
        if (user) {
            this.student = user;
            this.showModal.set(true);
        }
    }
}
