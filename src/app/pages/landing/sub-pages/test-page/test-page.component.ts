import { AfterViewInit, Component, ContentChild, QueryList, contentChild, contentChildren, TemplateRef, viewChild, viewChildren, ContentChildren, OnInit, signal } from '@angular/core';
import { ConfigurableTableComponent } from '../../../../generic-components/configurable-table/configurable-table.component';
import { TableColumn } from '../../../../shared/models/TableColumn ';
import { ChipModule } from 'primeng/chip';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';
import { FormField, Structure } from '../../../../generic-components/configurable-form/related-models';
import { FormGroup, Validators } from '@angular/forms';
import { ConfigurableFormExampleComponent } from '../../../../generic-components/configurable-form/configurable-form-example';
import { ConfigurableGridComponent, IGridRow } from '../../../../generic-components/configurable-grid/configurable-grid.component';
import { CommonModule } from '@angular/common';
import type { ColDef, GridOptions, RowSelectedEvent } from 'ag-grid-community';

@Component({
    selector: 'app-test-page',
    imports: [ConfigurableGridComponent, CommonModule],
    templateUrl: './test-page.component.html',
    styleUrl: './test-page.component.scss'
})
export class TestPageComponent {
    // Sample data for demonstration
    sampleData = signal<IGridRow[]>([
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', department: 'Engineering', salary: 75000, active: true },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', department: 'Marketing', salary: 65000, active: true },
        { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', department: 'Sales', salary: 55000, active: false },
        { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', department: 'Engineering', salary: 80000, active: true },
        { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', department: 'HR', salary: 60000, active: true },
        { id: 6, name: 'Diana Davis', email: 'diana.davis@example.com', department: 'Finance', salary: 70000, active: false },
        { id: 7, name: 'Eve Miller', email: 'eve.miller@example.com', department: 'Engineering', salary: 85000, active: true },
        { id: 8, name: 'Frank Garcia', email: 'frank.garcia@example.com', department: 'Marketing', salary: 62000, active: true }
    ]);

    // Column definitions
    columnDefs = signal<ColDef[]>([
        { field: 'id', headerName: 'ID', width: 80, sortable: true },
        { field: 'name', headerName: 'Name', width: 150, sortable: true, filter: true },
        { field: 'email', headerName: 'Email', width: 200, sortable: true, filter: true },
        { field: 'department', headerName: 'Department', width: 130, sortable: true, filter: true },
        {
            field: 'salary',
            headerName: 'Salary',
            width: 120,
            sortable: true,
            filter: true,
            valueFormatter: (params: any) => `$${params.value.toLocaleString()}`
        },
        {
            field: 'active',
            headerName: 'Active',
            width: 100,
            sortable: true,
            filter: true,
            cellRenderer: (params: any) => (params.value ? '✅' : '❌')
        }
    ]);

    // Grid options
    gridOptions = signal<GridOptions>({
        rowHeight: 50,
        pagination: true,
        paginationPageSize: 5,
        suppressRowClickSelection: false,
        rowSelection: 'single'
    });

    // Handle row selection
    onRowSelected(event: RowSelectedEvent) {
        console.log('Row selected:', event.data);
        // You can emit this to parent component or handle as needed
    }
}
