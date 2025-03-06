import { AfterViewInit, Component, computed, inject, input, model, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventInput } from '@fullcalendar/core/index.js';
import { SlotService } from '../../../../shared/services/slot.service';
import { firstValueFrom } from 'rxjs';
import { SlotCreateDTO, SlotUpdateDTO } from '../../../../shared/models/slot';

@Component({
    selector: 'app-modal-create-appointment',
    standalone: false,

    templateUrl: './modal-create-appointment.component.html',
    styleUrl: './modal-create-appointment.component.scss'
})
export class ModalCreateAppointmentComponent implements OnInit {
    visible = model<boolean>(false);
    selectedSlot = input.required<EventInput>();
    appointment = input.required<EventInput>();
    onSubmitted = output<void>();
    isCreatingModal = input<boolean>(true);
    studentFullName = computed(() => {
        return '' + this.appointment().extendedProps?.['slot']?.['studentFirstName'] + ' ' + this.appointment().extendedProps?.['slot']?.['studentLastName'];
    });
    price: number = 15;
    reduction: number = 0;
    userForm!: FormGroup;

    fb = inject(FormBuilder);
    slotService = inject(SlotService);

    async ngOnInit() {
        if (this.isCreatingModal()) {
            this.userForm = this.fb.group({
                startAt: [this.selectedSlot().start, [Validators.required]],
                endAt: [this.selectedSlot().end, [Validators.required]],
                price: [15, [Validators.required, Validators.pattern('^[0-9]*$')]],
                reduction: [0, [Validators.required]],
                type: [0, [Validators.required]]
            });
        } else {
            this.userForm = this.fb.group({
                startAt: [this.selectedSlot().start, [Validators.required]],
                endAt: [this.selectedSlot().end, [Validators.required]],
                price: [this.appointment().extendedProps?.['slot']?.price, [Validators.required, Validators.pattern('^[0-9]*$')]],
                reduction: [this.appointment().extendedProps?.['slot']?.reduction, [Validators.required]],
                type: [this.appointment().extendedProps?.['slot']?.type, [Validators.required]]
            });
        }
    }
    close() {
        this.onSubmitted.emit();
        this.visible.set(false);
    }
    async submit() {
        try {
            if (this.isCreatingModal()) {
                const newAppointment: SlotCreateDTO = {
                    startAt: this.userForm.value.startAt as Date,
                    endAt: this.userForm.value.endAt as Date,
                    price: this.userForm.value.price,
                    reduction: this.userForm.value.reduction,
                    type: this.userForm.value.type,
                    createdAt: new Date()
                };
                await firstValueFrom(this.slotService.addSlotByCreator(newAppointment));
            } else {
                const updatedAppointment: SlotUpdateDTO = {
                    id: this.appointment().extendedProps?.['slot']?.id,
                    startAt: this.selectedSlot().start as Date,
                    endAt: this.selectedSlot().end as Date,
                    price: this.userForm.value.price,
                    reduction: this.userForm.value.reduction,
                    type: this.userForm.value.type,
                    createdAt: new Date()
                };
                await firstValueFrom(this.slotService.updateSlotByCreator(updatedAppointment));
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.onSubmitted.emit();
            this.close();
        }
    }
}
