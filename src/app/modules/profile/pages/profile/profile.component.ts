import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserResponseDTO } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: false,

    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    authService = inject(AuthService);
    user = this.authService.userConnected;
    ngOnInit(): void {}
    items: MenuItem[] = [
        {
            label: 'Save',
            icon: 'pi pi-check'
        },
        {
            label: 'Update',
            icon: 'pi pi-upload'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            label: 'Home Page',
            icon: 'pi pi-home'
        }
    ];

    userToDisplay: UserResponseDTO = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.com',
        imgUrl: 'https://images.freeimages.com/365/images/previews/85b/psd-universal-blue-web-user-icon-53242.jpg',
        dateOfBirth: new Date('1986-04-21'),
        gender: 0,
        lastLogginAt: new Date(),
        emailConfirmed: true,
        roles: ['Student', 'Teacher']
    };
}
