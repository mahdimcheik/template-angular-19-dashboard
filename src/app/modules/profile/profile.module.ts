import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SelectModule } from 'primeng/select';
import { FluidModule } from 'primeng/fluid';

@NgModule({
    declarations: [ProfileComponent],
    imports: [CommonModule, ProfileRoutingModule, FluidModule, SelectModule]
})
export class ProfileModule {
    constructor() {}
}
