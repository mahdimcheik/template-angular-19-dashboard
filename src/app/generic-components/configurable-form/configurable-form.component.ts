import { Component, inject, input, Input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { errorMessages, FormField } from './related-models';

@Component({
    selector: 'app-configurable-form',
    imports: [FormsModule, ReactiveFormsModule, KeyValuePipe],
    templateUrl: './configurable-form.component.html',
    styleUrl: './configurable-form.component.scss'
})
export class ConfigurableFormComponent implements OnInit {
    fb = inject(FormBuilder);
    errorMessages = errorMessages;

    fields = input<FormField<any>[]>([]);
    onValidated = output<FormGroup>();
    form = this.fb.group({});

    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        this.fields().forEach((controlConfig) => {
            const control = this.fb.control(controlConfig.value, controlConfig.validation);
            this.form.addControl(controlConfig.name, control);
        });
    }

    onSubmit() {
        if (this.form.valid) {
            this.onValidated.emit(this.form);
        } else {
            this.form.markAllAsTouched();
            console.log('Formulaire invalide.');
        }
    }
}
