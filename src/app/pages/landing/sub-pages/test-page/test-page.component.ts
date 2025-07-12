import { AfterViewInit, Component, ContentChild, QueryList, contentChild, contentChildren, TemplateRef, viewChild, viewChildren, ContentChildren, OnInit } from '@angular/core';
import { ConfigurableTableComponent } from '../../../../generic-components/configurable-table/configurable-table.component';
import { TableColumn } from '../../../../shared/models/TableColumn ';
import { ChipModule } from 'primeng/chip';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';
import { FormField } from '../../../../generic-components/configurable-form/related-models';
import { FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-test-page',
    imports: [ConfigurableTableComponent, ChipModule, ConfigurableFormComponent],
    templateUrl: './test-page.component.html',
    styleUrl: './test-page.component.scss'
})
export class TestPageComponent implements AfterViewInit, OnInit {
    userTableColumns: TableColumn[] = [
        { field: 'id', header: 'ID', sortable: true },
        { field: 'name', header: 'Nom', filter: true },
        { field: 'email', header: 'Email', filter: true },
        { field: 'createdAt', header: 'Créé le', type: 'date' }
    ];

    users = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', createdAt: new Date() },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', createdAt: new Date() },
        { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', createdAt: new Date() }
    ];

    ngAfterViewInit(): void {
        this.userTableColumns = [
            { field: 'id', header: 'ID', sortable: true, templateName: 'chipTemplate' },
            { field: 'name', header: 'Nom', filter: true },
            { field: 'email', header: 'Email', filter: true },
            { field: 'createdAt', header: 'Créé le', type: 'date' }
        ];
    }

    formConfig: FormField<any>[] = [
        {
            id: 'firstName',
            name: 'firstName',
            label: 'Prénom',
            value: '',
            type: 'text',
            validation: [Validators.required, Validators.minLength(3)]
        },
        {
            id: 'email',
            name: 'email',
            label: 'Adresse e-mail',
            value: '',
            type: 'email',
            validation: [Validators.required, Validators.email]
        },
        {
            id: 'age',
            name: 'age',
            label: 'Âge',
            value: null,
            type: 'number',
            validation: [Validators.min(18)]
        }
    ];

    form = new FormGroup({});

    ngOnInit(): void {}
}
