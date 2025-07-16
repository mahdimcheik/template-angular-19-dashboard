import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal, effect, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions, GridApi, RowSelectedEvent } from 'ag-grid-community';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

// Generic interface for any row data
export interface IGridRow {
    [key: string]: any;
}

@Component({
    selector: 'app-configurable-grid',
    imports: [AgGridAngular, CommonModule, InputTextModule, FormsModule],
    templateUrl: './configurable-grid.component.html',
    styleUrl: './configurable-grid.component.scss'
})
export class ConfigurableGridComponent {
    // Input signals for configuration
    rowData = input<IGridRow[]>([]);
    columnDefs = input<ColDef[]>([]);
    gridOptions = input<GridOptions>({});
    className = input<string>('ag-theme-alpine');
    searchPlaceholder = input<string>('Search all columns...');
    showSearch = input<boolean>(true);

    // Output signals for events
    rowSelected = output<RowSelectedEvent>();

    // Internal signals
    private gridApi = signal<GridApi | null>(null);
    searchTerm = signal<string>('');

    // Computed values
    filteredRowData = computed(() => {
        const data = this.rowData();
        const search = this.searchTerm();

        if (!search.trim()) {
            return data;
        }

        return data.filter((row) => {
            return Object.values(row).some((value) => String(value).toLowerCase().includes(search.toLowerCase()));
        });
    });

    // Default column definition
    defaultColDef: ColDef = {
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true
    };

    // Grid ready event handler
    onGridReady(params: any) {
        this.gridApi.set(params.api);
    }

    // Row selection event handler
    onRowSelected(event: RowSelectedEvent) {
        this.rowSelected.emit(event);
    }

    // Search input change handler
    onSearchChange(value: string) {
        this.searchTerm.set(value);
    }

    // Clear search
    clearSearch() {
        this.searchTerm.set('');
    }
}
