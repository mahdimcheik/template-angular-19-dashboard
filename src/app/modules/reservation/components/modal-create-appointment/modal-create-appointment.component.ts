import { AfterViewInit, Component, computed, inject, input, model, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventInput } from '@fullcalendar/core/index.js';
import { SlotService } from '../../../../shared/services/slot.service';
import { catchError, finalize, firstValueFrom } from 'rxjs';
import { SlotCreateDTO, SlotUpdateDTO } from '../../../../shared/models/slot';
import { MessageService } from 'primeng/api';

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
    passedReservation = signal<boolean>(false);
    price: number = 15;
    reduction: number = 0;
    userForm!: FormGroup;

    fb = inject(FormBuilder);
    slotService = inject(SlotService);
    messageService = inject(MessageService);

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
        console.log('this.appointment', this.appointment().extendedProps);

        if (this.appointment().extendedProps?.['slot']?.['studentId'] != null && new Date(this.appointment().extendedProps?.['slot']?.['startAt']) < new Date()) {
            this.passedReservation.set(true);
        }
    }
    close() {
        this.onSubmitted.emit();
        this.visible.set(false);
    }
    submit() {
        if (this.isCreatingModal()) {
            const newAppointment: SlotCreateDTO = {
                startAt: this.userForm.value.startAt as Date,
                endAt: this.userForm.value.endAt as Date,
                price: this.userForm.value.price,
                reduction: this.userForm.value.reduction,
                type: this.userForm.value.type,
                createdAt: new Date()
            };
            this.slotService
                .addSlotByCreator(newAppointment)
                .pipe(
                    catchError((err) => {
                        console.error(err);
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la création du créneau' });
                        return [];
                    })
                )
                .subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Créneau créé avec succès' });
                    // this.onSubmitted.emit();
                    this.close();
                });
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
            this.slotService
                .updateSlotByCreator(updatedAppointment)
                .pipe(
                    catchError((err) => {
                        console.error(err);
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la création du créneau' });
                        return [];
                    })
                )
                .subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Créneau créé avec succès' });
                    // this.onSubmitted.emit();
                    this.close();
                });
        }
    }

    deleteSlot() {
        this.slotService
            .deleteSlotByCreator(this.appointment().extendedProps?.['slot']?.id)
            .pipe(
                catchError((err) => {
                    console.error(err);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la suppression du créneau' });
                    return [];
                }),
                finalize(() => {
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Créneau supprimé avec succès' });
                    // this.onSubmitted.emit();
                    this.close();
                })
            )
            .subscribe();
    }
}
