import { AfterViewInit, Component, inject, input, model, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventInput } from '@fullcalendar/core/index.js';
import { SlotService } from '../../../../shared/services/slot.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-modal-edit-appointment',
    standalone: false,

    templateUrl: './modal-edit-appointment.component.html',
    styleUrl: './modal-edit-appointment.component.scss'
})
export class ModalEditAppointmentComponent implements OnInit {
    visible = model<boolean>(false);
    appointment = input.required<EventInput>();
    onSubmitted = output<void>();
    price: number = 15;
    reduction: number = 0;
    userForm!: FormGroup;

    fb = inject(FormBuilder);
    slotService = inject(SlotService);

    ngOnInit(): void {
        console.log('appointment', this.appointment());

        this.userForm = this.fb.group({
            id: [this.appointment().extendedProps?.['slot']?.id, [Validators.required]],
            startAt: [this.appointment().start, [Validators.required]],
            endAt: [this.appointment().end, [Validators.required]],
            price: [this.appointment().extendedProps?.['slot']?.['price'], [Validators.required, Validators.pattern('^[0-9]*$')]],
            reduction: [this.appointment().extendedProps?.['slot']?.['reduction'], [Validators.required]],
            type: [this.appointment().extendedProps?.['slot']?.['type'], [Validators.required]]
        });
    }
    close() {
        this.visible.set(false);
    }

    async submit() {
        try {
            await firstValueFrom(this.slotService.updateSlotByCreator(this.userForm.value));
            this.onSubmitted.emit();
            this.close();
        } catch (e) {
            console.error(e);
        }
    }
}
