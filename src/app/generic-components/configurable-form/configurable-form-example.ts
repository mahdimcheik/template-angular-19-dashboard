import { Component, signal } from '@angular/core';
import { FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Structure } from './related-models';
import { ConfigurableFormComponent } from './configurable-form.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-configurable-form-example',
    standalone: true,
    imports: [ConfigurableFormComponent, CommonModule],
    styleUrl: './configurable-form-example.component.scss',
    template: `
        <div class="p-6 bg-gray-50 min-h-screen all-around-container">
            <h1 class="text-3xl font-bold mb-6">Configurable Form Example</h1>

            <!-- Form Component -->
            <div class="test-container">
                <app-configurable-form [structure]="sampleStructure" #formComponent> </app-configurable-form>
            </div>

            <!-- Debug Panel -->
            <div class="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <h2 class="text-xl font-semibold mb-4">Debug Information</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Structured Form Values -->
                    <div>
                        <h3 class="font-medium text-gray-800 mb-2">Structured Form Values:</h3>
                        <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto">{{ getStructuredValues() | json }}</pre>
                    </div>

                    <!-- Flattened Form Values -->
                    <div>
                        <h3 class="font-medium text-gray-800 mb-2">Flattened Form Values:</h3>
                        <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto">{{ getFlattenedValues() | json }}</pre>
                    </div>
                </div>

                <!-- Form Status -->
                <div class="mt-4 p-4 bg-blue-50 rounded-md">
                    <h3 class="font-medium text-blue-800 mb-2">Form Status:</h3>
                    <ul class="text-sm text-blue-700 space-y-1">
                        <li>Form Valid: {{ isFormValid() }}</li>
                        <li>Form Touched: {{ isFormTouched() }}</li>
                        <li>Total Form Groups: {{ sampleStructure.formFieldGroups.length }}</li>
                    </ul>
                </div>

                <!-- Section Status -->
                <div class="mt-4">
                    <h3 class="font-medium text-gray-800 mb-2">Section Status:</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        @for (group of sampleStructure.formFieldGroups; track group.id) {
                            <div class="p-3 border rounded-md">
                                <h4 class="font-medium text-sm">{{ group.name }}</h4>
                                <div class="mt-1 text-xs text-gray-600">
                                    <div>ID: {{ group.id }}</div>
                                    <div>Fields: {{ group.fields.length }}</div>
                                    <div>Group Validators: {{ group.groupValidators ? group.groupValidators.length : 0 }}</div>
                                    <div class="mt-1">
                                        <span [class]="getSectionStatusColor(group.id)">
                                            {{ getSectionStatus(group.id) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ConfigurableFormExampleComponent {
    // Signal to track form submission results
    lastSubmittedValues = signal<any>(null);

    sampleStructure: Structure = {
        id: 'user-profile-form',
        name: 'Profil Utilisateur',
        description: 'Formulaire de création et modification du profil utilisateur avec validation de groupe',
        icon: 'pi pi-user',
        styleClass: 'user-profile-form',
        formFieldGroups: [
            {
                id: 'personal-info',
                name: 'Informations Personnelles',
                description: 'Renseignez vos informations personnelles',
                icon: 'pi pi-id-card',
                styleClass: 'personal-info-group',
                fields: [
                    {
                        id: 'firstName',
                        name: 'firstName',
                        label: 'Prénom',
                        type: 'text',
                        placeholder: 'Entrez votre prénom',
                        required: true,
                        validation: [Validators.required, Validators.minLength(2)]
                    },
                    {
                        id: 'lastName',
                        name: 'lastName',
                        label: 'Nom',
                        type: 'text',
                        placeholder: 'Entrez votre nom',
                        required: true,
                        validation: [Validators.required, Validators.minLength(2)]
                    },
                    {
                        id: 'email',
                        name: 'email',
                        label: 'Email',
                        type: 'email',
                        placeholder: 'exemple@email.com',
                        required: true,
                        validation: [Validators.required, Validators.email]
                    },
                    {
                        id: 'phone',
                        name: 'phone',
                        label: 'Téléphone',
                        type: 'text',
                        placeholder: '+33 1 23 45 67 89',
                        validation: [Validators.pattern(/^[+]?[0-9\s\-\(\)]+$/)]
                    }
                ],
                // Group validator: ensure first name and last name are not the same
                groupValidators: [this.namesShouldBeDifferent.bind(this)]
            },
            {
                id: 'password-info',
                name: 'Mot de Passe',
                description: 'Définissez votre mot de passe',
                icon: 'pi pi-lock',
                fields: [
                    {
                        id: 'password',
                        name: 'password',
                        label: 'Mot de passe',
                        type: 'password',
                        placeholder: 'Entrez votre mot de passe',
                        required: true,
                        validation: [Validators.required, Validators.minLength(8)]
                    },
                    {
                        id: 'confirmPassword',
                        name: 'confirmPassword',
                        label: 'Confirmer le mot de passe',
                        type: 'password',
                        placeholder: 'Confirmez votre mot de passe',
                        required: true,
                        validation: [Validators.required]
                    }
                ],
                // Group validator: ensure password and confirmPassword match
                groupValidators: [this.passwordsMatch.bind(this)]
            },
            {
                id: 'date-range',
                name: "Période d'Activité",
                description: "Définissez votre période d'activité",
                icon: 'pi pi-calendar',
                fields: [
                    {
                        id: 'startDate',
                        name: 'startDate',
                        label: 'Date de début',
                        type: 'date',
                        required: true,
                        validation: [Validators.required]
                    },
                    {
                        id: 'endDate',
                        name: 'endDate',
                        label: 'Date de fin',
                        type: 'date',
                        required: true,
                        validation: [Validators.required]
                    }
                ],
                // Group validator: ensure start date is before end date
                groupValidators: [this.dateRangeValid.bind(this)]
            },
            {
                id: 'address-info',
                name: 'Adresse',
                description: 'Informations de votre adresse de résidence',
                icon: 'pi pi-home',
                fields: [
                    {
                        id: 'street',
                        name: 'street',
                        label: 'Rue',
                        type: 'text',
                        placeholder: 'Numéro et nom de rue',
                        required: true,
                        validation: [Validators.required]
                    },
                    {
                        id: 'city',
                        name: 'city',
                        label: 'Ville',
                        type: 'text',
                        placeholder: 'Votre ville',
                        required: true,
                        validation: [Validators.required]
                    },
                    {
                        id: 'postalCode',
                        name: 'postalCode',
                        label: 'Code postal',
                        type: 'text',
                        placeholder: '75000',
                        required: true,
                        validation: [Validators.required, Validators.pattern(/^\d{5}$/)]
                    },
                    {
                        id: 'country',
                        name: 'country',
                        label: 'Pays',
                        type: 'select',
                        placeholder: 'Sélectionnez votre pays',
                        options: ['France', 'Belgique', 'Suisse', 'Canada', 'Autre'],
                        required: true,
                        validation: [Validators.required]
                    }
                ],
                // Group validator: ensure postal code matches country format
                groupValidators: [this.postalCodeMatchesCountry.bind(this)]
            },
            {
                id: 'preferences',
                name: 'Préférences',
                description: 'Vos préférences et paramètres',
                icon: 'pi pi-cog',
                fields: [
                    {
                        id: 'newsletter',
                        name: 'newsletter',
                        label: 'Newsletter',
                        type: 'checkbox',
                        placeholder: 'Je souhaite recevoir la newsletter',
                        value: false
                    },
                    {
                        id: 'notifications',
                        name: 'notifications',
                        label: 'Type de notifications',
                        type: 'radio',
                        options: ['Email', 'SMS', 'Push', 'Aucune'],
                        value: 'Email',
                        required: true,
                        validation: [Validators.required]
                    },
                    {
                        id: 'contactEmail',
                        name: 'contactEmail',
                        label: 'Email de contact (optionnel)',
                        type: 'email',
                        placeholder: 'contact@example.com',
                        validation: [Validators.email]
                    }
                ],
                // Group validator: if newsletter is checked, contact email is required
                groupValidators: [this.newsletterRequiresContactEmail.bind(this)]
            }
        ]
    };

    // Custom Group Validators
    namesShouldBeDifferent(control: AbstractControl): ValidationErrors | null {
        const firstName = control.get('firstName')?.value;
        const lastName = control.get('lastName')?.value;

        if (firstName && lastName && firstName.toLowerCase() === lastName.toLowerCase()) {
            return { namesShouldBeDifferent: true };
        }
        return null;
    }

    passwordsMatch(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        if (password && confirmPassword && password !== confirmPassword) {
            return { passwordsDoNotMatch: true };
        }
        return null;
    }

    dateRangeValid(control: AbstractControl): ValidationErrors | null {
        const startDate = control.get('startDate')?.value;
        const endDate = control.get('endDate')?.value;

        if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
            return { invalidDateRange: true };
        }
        return null;
    }

    postalCodeMatchesCountry(control: AbstractControl): ValidationErrors | null {
        const postalCode = control.get('postalCode')?.value;
        const country = control.get('country')?.value;

        if (postalCode && country) {
            // Simple validation example
            if (country === 'France' && !/^\d{5}$/.test(postalCode)) {
                return { invalidFrenchPostalCode: true };
            }
            if (country === 'Belgique' && !/^\d{4}$/.test(postalCode)) {
                return { invalidBelgiumPostalCode: true };
            }
        }
        return null;
    }

    newsletterRequiresContactEmail(control: AbstractControl): ValidationErrors | null {
        const newsletter = control.get('newsletter')?.value;
        const contactEmail = control.get('contactEmail')?.value;

        if (newsletter && !contactEmail) {
            return { contactEmailRequired: true };
        }
        return null;
    }

    handleFormSubmit(formGroup: FormGroup) {
        console.log('=== FORM SUBMISSION ===');
        console.log('Form Group:', formGroup);
        console.log('Form Valid:', formGroup.valid);
        console.log('Form Touched:', formGroup.touched);

        // Structured values (nested by FormFieldGroup)
        const structuredValues = formGroup.value;
        console.log('Structured Values:', structuredValues);

        // Flattened values (all fields at root level)
        const flattenedValues = this.flattenFormValues(structuredValues);
        console.log('Flattened Values:', flattenedValues);

        // Individual section values and validation
        console.log('=== SECTION VALUES AND VALIDATION ===');
        this.sampleStructure.formFieldGroups.forEach((group) => {
            const sectionFormGroup = formGroup.get(group.id) as FormGroup;
            const sectionValue = sectionFormGroup?.value;
            const sectionValid = sectionFormGroup?.valid;
            const sectionErrors = sectionFormGroup?.errors;

            console.log(`${group.name} (${group.id}):`);
            console.log('  Values:', sectionValue);
            console.log('  Valid:', sectionValid);
            console.log('  Group Errors:', sectionErrors);
        });

        // Store last submitted values
        this.lastSubmittedValues.set({
            structured: structuredValues,
            flattened: flattenedValues,
            timestamp: new Date()
        });

        alert('Formulaire soumis avec succès! Consultez la console pour voir les valeurs détaillées.');
    }

    // Helper methods for debug panel
    getStructuredValues(): any {
        return 'Form values will be logged to console on submit';
    }

    getFlattenedValues(): any {
        return 'Flattened form values will be logged to console on submit';
    }

    isFormValid(): boolean {
        // Form validation is handled internally by the component
        return true;
    }

    isFormTouched(): boolean {
        // Form touch state is handled internally by the component
        return false;
    }

    getSectionStatus(groupId: string): string {
        // This would need access to the component instance
        return 'Unknown'; // Placeholder
    }

    getSectionStatusColor(groupId: string): string {
        const status = this.getSectionStatus(groupId);
        switch (status) {
            case 'Valid':
                return 'text-green-600';
            case 'Invalid':
                return 'text-red-600';
            case 'Pristine':
                return 'text-gray-500';
            default:
                return 'text-gray-500';
        }
    }

    private flattenFormValues(structuredValues: any): any {
        const flattened: any = {};

        Object.keys(structuredValues).forEach((groupId) => {
            const groupValue = structuredValues[groupId];
            if (groupValue && typeof groupValue === 'object') {
                Object.keys(groupValue).forEach((fieldName) => {
                    flattened[fieldName] = groupValue[fieldName];
                });
            }
        });

        return flattened;
    }
}
