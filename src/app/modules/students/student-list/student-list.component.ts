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

@Component({
    selector: 'app-student-list',
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule, PaginatorModule],

    templateUrl: './student-list.component.html',
    styleUrl: './student-list.component.scss'
})
export class StudentListComponent {
    layout: 'list' | 'grid' = 'list';

    options = ['list', 'grid'];

    adminService = inject(AdminService);

    students = signal<UserResponseDTO[]>([]);
    countUsers = signal(0);

    first = 0;
    rows = 2;

    ngOnInit() {
        this.adminService.getAllStudents(this.first, this.rows).subscribe((res) => {
            this.students.set(res.data);
            this.countUsers.set(res.count ?? 0);
        });
    }
    loadReservations(e: any) {
        this.adminService.getAllStudents(e.first, this.rows).subscribe((res) => {
            this.students.set(res.data);
            this.countUsers.set(res.count ?? 0);
        });
    }
}
