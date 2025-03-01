import { AfterViewInit, Component, inject, input, model, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventInput } from '@fullcalendar/core/index.js';
import { SlotService } from '../../../../shared/services/slot.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-modal-create-appointment',
    standalone: false,

    templateUrl: './modal-create-appointment.component.html',
    styleUrl: './modal-create-appointment.component.scss'
})
export class ModalCreateAppointmentComponent implements OnInit {
    visible = model<boolean>(false);
    appointment = input.required<EventInput>();
    onSubmitted = output<void>();
    price: number = 15;
    reduction: number = 0;
    userForm!: FormGroup;

    fb = inject(FormBuilder);
    slotService = inject(SlotService);

    ngOnInit(): void {
        this.userForm = this.fb.group({
            startAt: [this.appointment().start, [Validators.required]],
            endAt: [this.appointment().end, [Validators.required]],
            price: [15, [Validators.required, Validators.pattern('^[0-9]*$')]],
            reduction: [0, [Validators.required]],
            type: [0, [Validators.required]]
        });
    }
    close() {
        this.visible.set(false);
    }

    async submit() {
        try {
            await firstValueFrom(this.slotService.addSlotByCreator(this.userForm.value));
            this.onSubmitted.emit();
            this.close();
        } catch (e) {
            console.error(e);
        }
    }
}
