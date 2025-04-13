import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Notfound } from './notfound/notfound';

export default [
    {
        path: 'not-found',
        component: Notfound
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
