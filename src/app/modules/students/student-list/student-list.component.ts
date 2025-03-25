import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { StudentCardComponent } from '../components/student-card/student-card.component';
import { AdminService } from '../../../shared/services/admin.service';

@Component({
    selector: 'app-student-list',
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule],

    templateUrl: './student-list.component.html',
    styleUrl: './student-list.component.scss'
})
export class StudentListComponent {
    layout: 'list' | 'grid' = 'list';

    options = ['list', 'grid'];

    adminService = inject(AdminService);
    students = this.adminService.allStudents;

    ngOnInit() {
        this.adminService.getAllStudents().subscribe((res) => {
            this.students.set(res);
            console.log('Students: ', this.students());
        });
    }
}
