import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SelectModule } from 'primeng/select';
import { FluidModule } from 'primeng/fluid';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { TabsModule } from 'primeng/tabs';
import { ToolbarModule } from 'primeng/toolbar';
import { PersonnalInfosComponent } from './components/personnal-infos/personnal-infos.component';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { DobToAgePipe } from '../../shared/pipes/dob-to-age.pipe';
import { AdressesListComponent } from './components/adresses-list/adresses-list.component';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AdressComponent } from './components/address/address.component';
import { FormationComponent } from './components/formation/formation.component';
import { FormationsListComponent } from './components/formations-list/formations-list.component';
import { ModalAddOrEditAddressComponent } from './components/modal-add-or-edit-address/modal-add-or-edit-address.component';
import { DrawerModule } from 'primeng/drawer';
import { PopoverModule } from 'primeng/popover';
import { MessageModule } from 'primeng/message';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ModalEditOrAddFormationComponent } from './components/modal-edit-or-add-formation/modal-edit-or-add-formation.component';
import { ModalEditPersonnalInfosComponent } from './components/modal-edit-personnal-infos/modal-edit-personnal-infos.component';
import { GenericMessageComponent } from '../../pages/uikit/generic-message/generic-message.component';
import { TextareaModule } from 'primeng/textarea';
import { RequiredAsteriskDirective } from '../../shared/directives/required-asterisk.directive';
import { FileUploadModule } from 'primeng/fileupload';
import { ModalConfirmDeleteComponent } from './components/modal-confirm-delete/modal-confirm-delete.component';
import { DialogModule } from 'primeng/dialog';
import { AdresseImagePipe } from '../../shared/pipes/adresse-type.pipe';

@NgModule({
    declarations: [
        ProfileComponent,
        PersonnalInfosComponent,
        AdressesListComponent,
        AdressComponent,
        FormationComponent,
        FormationsListComponent,
        ModalAddOrEditAddressComponent,
        ModalEditOrAddFormationComponent,
        ModalEditPersonnalInfosComponent,
        ModalConfirmDeleteComponent
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FluidModule,
        SelectModule,
        FormsModule,
        ToolbarModule,
        TabsModule,
        SplitterModule,
        SplitButtonModule,
        RippleModule,
        PanelModule,
        MenuModule,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        FieldsetModule,
        DividerModule,
        ButtonModule,
        AccordionModule,
        ImageModule,
        TagModule,
        DobToAgePipe,
        DataViewModule,
        OrderListModule,
        PickListModule,
        SelectButtonModule,
        DrawerModule,
        PopoverModule,
        MessageModule,
        ReactiveFormsModule,
        DatePickerModule,
        GenericMessageComponent,
        TextareaModule,
        RequiredAsteriskDirective,
        FileUploadModule,
        DialogModule,
        AdresseImagePipe
    ]
})
export class ProfileModule {
    constructor() {}
}
