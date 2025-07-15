import { Routes } from '@angular/router';
import { MainComponent } from './sub-pages/main/main.component';
import { TeacherPublicProfileComponent } from './sub-pages/teacher-public-profile/teacher-public-profile.component';
import { MentionsLegalesComponent } from './sub-pages/mentions-legales/mentions-legales.component';
import { TestPageComponent } from './sub-pages/test-page/test-page.component';

export default [
    {
        path: '',
        component: MainComponent
    },
    {
        path: 'teacher',
        component: TeacherPublicProfileComponent
    },
    {
        path: 'mentions-legales',
        component: MentionsLegalesComponent
    },
    {
        path: 'test',
        component: TestPageComponent
    }
] as Routes;
