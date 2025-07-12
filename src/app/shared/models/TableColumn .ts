import { TemplateRef } from '@angular/core';

export interface TableColumn {
    field: string;
    header: string;
    type?: 'text' | 'date' | 'number' | 'boolean' | 'custom';
    filter?: boolean;
    sortable?: boolean;
    width?: string;
    templateName?: string;
}
