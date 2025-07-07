import { Routes } from '@angular/router';
import { Notfound } from './notfound/notfound';

export default [
    {
        path: 'not-found',
        component: Notfound
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
