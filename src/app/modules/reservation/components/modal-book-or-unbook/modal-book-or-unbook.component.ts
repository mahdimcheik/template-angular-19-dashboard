import { AfterViewInit, Component, inject, input, model, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventInput } from '@fullcalendar/core/index.js';
import { SlotService } from '../../../../shared/services/slot.service';
import { firstValueFrom } from 'rxjs';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';
import { Title } from '@angular/platform-browser';

type TypeHelpType = {
    id: number;
    value: string;
};

@Component({
    selector: 'app-modal-book-or-unbook',
    standalone: false,

    templateUrl: './modal-book-or-unbook.component.html',
    styleUrl: './modal-book-or-unbook.component.scss'
})
export class ModalBookOrUnbookComponent implements OnInit {
    visible = model<boolean>(false);
    appointment = input.required<EventInput>();
    userForm!: FormGroup;
    title: string = '';
    description: string = '';
    type: number = 0;

    fb = inject(FormBuilder);
    slotService = inject(SlotService);

    typeHelpTransformInstance: HelpTypePipe = new HelpTypePipe();
    typesHelp = [
        {
            id: 0,
            value: this.typeHelpTransformInstance.transform(0)
        },
        {
            id: 1,
            value: this.typeHelpTransformInstance.transform(1)
        },
        {
            id: 2,
            value: this.typeHelpTransformInstance.transform(2)
        }
    ];

    ngOnInit(): void {
        this.userForm = this.fb.group({
            typeHelp: [this.type, Validators.required],
            description: [this.description, Validators.required],
            title: [this.title, Validators.required]
        });
    }
    close() {
        this.visible.set(false);
    }

    async submit() {
        try {
            this.close();
        } catch (e) {
            console.error(e);
        }
    }
}
