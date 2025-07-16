import { AfterViewInit, Component, ContentChild, QueryList, contentChild, contentChildren, TemplateRef, viewChild, viewChildren, ContentChildren, OnInit } from '@angular/core';
import { ConfigurableTableComponent } from '../../../../generic-components/configurable-table/configurable-table.component';
import { TableColumn } from '../../../../shared/models/TableColumn ';
import { ChipModule } from 'primeng/chip';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';
import { FormField, Structure } from '../../../../generic-components/configurable-form/related-models';
import { FormGroup, Validators } from '@angular/forms';
import { ConfigurableFormExampleComponent } from '../../../../generic-components/configurable-form/configurable-form-example';
import { ConfigurableGridComponent } from '../../../../generic-components/configurable-grid/configurable-grid.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-test-page',
    imports: [ConfigurableGridComponent, CommonModule],
    templateUrl: './test-page.component.html',
    styleUrl: './test-page.component.scss'
})
export class TestPageComponent {}
