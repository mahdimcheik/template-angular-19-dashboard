import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { canNotLoginGuard } from '../../shared/guards/can-login.guard';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        children: [
            {
                path: 'profile',
                component: ProfileComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule {}
