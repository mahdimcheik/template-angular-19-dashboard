import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Structure } from './related-models';
import { ConfigurableFormComponent } from './configurable-form.component';

@Component({
    selector: 'app-configurable-form-example',
    standalone: true,
    imports: [ConfigurableFormComponent],
    template: `
        <div class="p-6 bg-gray-50 min-h-screen">
            <h1 class="text-3xl font-bold mb-6">Configurable Form Example</h1>

            <app-configurable-form [structure]="sampleStructure" (onFormSubmit)="handleFormSubmit($event)"> </app-configurable-form>
        </div>
    `
})
export class ConfigurableFormExampleComponent {
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
        console.log('Form submitted with values:', formGroup.value);
        console.log('Form valid:', formGroup.valid);

        // Here you would typically send the data to your API
        alert('Formulaire soumis avec succès! Consultez la console pour voir les valeurs.');
    }
}
