import { Component, inject, input, output, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { errorMessages, FormField, FormFieldGroup, Structure } from './related-models';

@Component({
    selector: 'app-configurable-form',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './configurable-form.component.html',
    styleUrl: './configurable-form.component.scss'
})
export class ConfigurableFormComponent implements OnInit {
    private fb = inject(FormBuilder);

    // Input signal for the structure
    structure = input<Structure | null>(null);

    // Output signal for form submission
    onFormSubmit = output<FormGroup>();

    // Form instance
    form = signal<FormGroup>(this.fb.group({}));

    // Error messages map
    errorMessages = errorMessages;

    // Computed signal to track form validity
    isFormValid = computed(() => this.form().valid);

    // Computed signal to track if form has been touched
    isFormTouched = computed(() => this.form().touched);

    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        const structure = this.structure();
        if (!structure) {
            this.form.set(this.fb.group({}));
            return;
        }

        const formControls: { [key: string]: FormControl } = {};

        // Iterate through all form field groups
        structure.formFieldGroups.forEach((group: FormFieldGroup) => {
            // Iterate through all fields in the group
            group.fields.forEach((field: FormField<any>) => {
                const control = this.fb.control(
                    {
                        value: field.value || this.getDefaultValue(field.type),
                        disabled: field.disabled || false
                    },
                    field.validation || []
                );
                formControls[field.name] = control;
            });
        });

        this.form.set(this.fb.group(formControls));
    }

    private getDefaultValue(type: string): any {
        switch (type) {
            case 'checkbox':
                return false;
            case 'number':
                return 0;
            case 'date':
                return '';
            default:
                return '';
        }
    }

    onSubmit() {
        const formInstance = this.form();
        if (formInstance.valid) {
            this.onFormSubmit.emit(formInstance);
        } else {
            formInstance.markAllAsTouched();
            this.form.set(formInstance); // Trigger change detection
        }
    }

    getFieldError(fieldName: string): string | null {
        const control = this.form().get(fieldName);
        if (control && control.invalid && (control.dirty || control.touched)) {
            const errors = control.errors;
            if (errors) {
                const errorKey = Object.keys(errors)[0];
                return this.errorMessages[errorKey] ? this.errorMessages[errorKey](errors[errorKey]) : 'Erreur de validation';
            }
        }
        return null;
    }

    isFieldInvalid(fieldName: string): boolean {
        const control = this.form().get(fieldName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    getSelectOptions(field: FormField<any>): any[] {
        return field.options || [];
    }

    // Track function for @for loops
    trackByFieldId(index: number, field: FormField<any>): string {
        return field.id;
    }

    trackByGroupId(index: number, group: FormFieldGroup): string {
        return group.id;
    }
}
