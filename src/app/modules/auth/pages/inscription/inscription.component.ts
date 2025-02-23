import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { EnumGender, GenderDropDown, UserCreateDTO, UserLoginDTO } from '../../../../shared/models/user';
import { ageValidator, passwordStrengthValidator, passwordValidator } from '../../../../shared/validators/confirmPasswordValidator';

@Component({
    selector: 'app-inscription',
    standalone: false,
    templateUrl: './inscription.component.html',
    styleUrl: './inscription.component.scss',
    providers: [AuthService]
})
export class InscriptionComponent implements OnInit {
    authService = inject(AuthService);
    fb = inject(FormBuilder);
    router = inject(Router);

    typesGenderList: GenderDropDown[] = [
        {
            id: '0',
            name: 'Homme',
            value: EnumGender.Homme
        },
        {
            id: '1',
            name: 'Femme',
            value: EnumGender.Femme
        },
        {
            id: '2',
            name: 'Non-binaire',
            value: EnumGender.NonBinaire
        },
        {
            id: '3',
            name: 'Autre',
            value: EnumGender.Autre
        }
    ];
    selectedGender: GenderDropDown = {
        id: '3',
        name: 'Autre',
        value: EnumGender.Autre
    };

    userForm = this.fb.group(
        {
            email: ['', [Validators.email, Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
            confirmPassword: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            phoneNumber: [''],
            dateOfBirth: [new Date('1986-04-21'), [Validators.required, ageValidator()]],
            gender: [this.selectedGender, [Validators.required]],
            title: [''],
            description: ['']
        },
        { validators: [passwordValidator('password', 'confirmPassword')] }
    );

    ngOnInit() {
        // this.userForm.controls['dateOfBirth'].valueChanges.subscribe((value) => {
        //     console.log('Date of Birth Control Value:', value);
        // });
    }

    submit() {
        const newUser = {
            ...this.userForm.value,
            gender: this.userForm.value['gender']?.value
        } as UserCreateDTO;
        console.log('new user ', newUser);

        this.authService
            .register(newUser)
            .pipe(
                tap((res) => {
                    console.log('res', res);
                    this.router.navigateByUrl('auth/account-created');
                })
            )
            .subscribe();
    }
}
