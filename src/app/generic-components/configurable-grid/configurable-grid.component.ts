import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef, GridOptions, RowClassParams } from 'ag-grid-community'; // Column Definition Type Interface

interface IRow {
    make: string;
    model: string;
    price: number;
    electric: boolean;
}

@Component({
    selector: 'app-configurable-grid',
    imports: [AgGridAngular, CommonModule],
    templateUrl: './configurable-grid.component.html',
    styleUrl: './configurable-grid.component.scss'
})
export class ConfigurableGridComponent {
    rowData = input<IRow[]>([
        { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
        { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
        { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
        { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
        { make: 'Fiat', model: '500', price: 15774, electric: false },
        { make: 'Nissan', model: 'Juke', price: 20675, electric: false }
    ]);

    gridOptions: GridOptions = {
        rowHeight: 100
    };

    className = input<string>('ag-theme-alpine h-[500px]');

    // Column Definitions: Defines & controls grid columns.
    colDefs = computed(() => [{ field: 'make' }, { field: 'model' }, { field: 'price' }, { field: 'electric' }]);

    defaultColDef: ColDef = {
        flex: 1
    };
}
