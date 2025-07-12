import { Component, signal } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Structure } from './related-models';
import { ConfigurableFormComponent } from './configurable-form.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-configurable-form-example',
    standalone: true,
    imports: [ConfigurableFormComponent, CommonModule],
    template: `
        <div class="p-6 bg-gray-50 min-h-screen">
            <h1 class="text-3xl font-bold mb-6">Configurable Form Example</h1>

            <!-- Form Component -->
            <app-configurable-form [structure]="sampleStructure" (onFormSubmit)="handleFormSubmit($event)" #formComponent> </app-configurable-form>

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
        description: 'Formulaire de création et modification du profil utilisateur',
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
                    },
                    {
                        id: 'birthDate',
                        name: 'birthDate',
                        label: 'Date de naissance',
                        type: 'date',
                        required: true,
                        validation: [Validators.required]
                    },
                    {
                        id: 'gender',
                        name: 'gender',
                        label: 'Genre',
                        type: 'select',
                        placeholder: 'Sélectionnez votre genre',
                        options: ['Homme', 'Femme', 'Non binaire', 'Préfère ne pas dire'],
                        required: true,
                        validation: [Validators.required]
                    }
                ]
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
                ]
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
                        id: 'bio',
                        name: 'bio',
                        label: 'Biographie',
                        type: 'textarea',
                        placeholder: 'Parlez-nous de vous...',
                        validation: [Validators.maxLength(500)]
                    },
                    {
                        id: 'age',
                        name: 'age',
                        label: 'Âge',
                        type: 'number',
                        placeholder: '25',
                        validation: [Validators.min(18), Validators.max(120)]
                    }
                ]
            }
        ]
    };

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

        // Individual section values
        console.log('=== SECTION VALUES ===');
        this.sampleStructure.formFieldGroups.forEach((group) => {
            const sectionValue = formGroup.get(group.id)?.value;
            console.log(`${group.name} (${group.id}):`, sectionValue);
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
        return this.lastSubmittedValues()?.structured || {};
    }

    getFlattenedValues(): any {
        return this.lastSubmittedValues()?.flattened || {};
    }

    isFormValid(): boolean {
        // This would need access to the component instance
        return true; // Placeholder
    }

    isFormTouched(): boolean {
        // This would need access to the component instance
        return false; // Placeholder
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
