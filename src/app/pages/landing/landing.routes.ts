import { Routes } from '@angular/router';
import { MainComponent } from './sub-pages/main/main.component';
import { TeacherPublicProfileComponent } from './sub-pages/teacher-public-profile/teacher-public-profile.component';

export default [
    {
        path: '',
        component: MainComponent
    },
    {
        path: 'teacher',
        component: TeacherPublicProfileComponent
    }
] as Routes;
