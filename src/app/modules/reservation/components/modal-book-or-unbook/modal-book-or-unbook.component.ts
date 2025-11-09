import { AfterViewInit, Component, computed, inject, input, model, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventInput } from '@fullcalendar/core/index.js';
import { SlotMainService } from '../../../../shared/services/slotMain.service';
import { catchError, finalize, firstValueFrom, switchMap } from 'rxjs';
import { HelpTypePipe } from '../../../../shared/pipes/help-type.pipe';
import { BookingCreateDTO } from '../../../../api/models/BookingCreateDTO';
import { SlotResponseDTO } from '../../../../api/models/SlotResponseDTO';
import { OrderMainService } from '../../../../shared/services/orderMain.service';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';

type TypeHelpType = {
    id: number;
    value: string;
};

@Component({
    selector: 'app-modal-book-or-unbook',
    imports: [HelpTypePipe, InputTextModule, TextareaModule, MessageModule, ButtonModule, FluidModule, SelectModule, CommonModule, ReactiveFormsModule, DialogModule],

    templateUrl: './modal-book-or-unbook.component.html',
    styleUrl: './modal-book-or-unbook.component.scss'
})
export class ModalBookOrUnbookComponent implements OnInit {
    visible = model<boolean>(false);
    appointment = input.required<EventInput>();
    slotDetailed = computed<SlotResponseDTO>(() => this.appointment().extendedProps?.['slot'] as SlotResponseDTO);
    passedReservation = computed(() => this.appointment().extendedProps?.['slot']?.studentId !== null && new Date(this.appointment().extendedProps?.['slot']?.startAt) < new Date());
    isPaid = computed(() => this.appointment().extendedProps?.['slot']?.studentId !== null && this.appointment().extendedProps?.['slot']?.status == '1');

    onBooking = output();
    userForm!: FormGroup;
    title: string = '';
    description: string = '';
    typeHelpTransformInstance: HelpTypePipe = new HelpTypePipe();
    getDialogHeader = computed(() => {
        if (this.appointment().extendedProps?.['slot']?.studentId === null) {
            return 'Réservation';
        }
        return new Date(this.appointment().extendedProps?.['slot']?.startAt) < new Date() ? 'Détails' : 'Consultation';
    });

    fb = inject(FormBuilder);
    slotService = inject(SlotMainService);
    orderService = inject(OrderMainService);
    messageService = inject(MessageService);

    type = {
        id: 0,
        value: this.typeHelpTransformInstance.transform(0)
    };

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
            id: [this.appointment().id],
            typeHelp: [this.type, Validators.required],
            description: [this.description],
            subject: [this.title, [Validators.required, Validators.maxLength(64)]]
        });
    }

    close() {
        this.visible.set(false);
    }

    submit() {
        try {
            const newBooking: BookingCreateDTO = {
                slotId: this.appointment().extendedProps?.['slot']?.['id'],
                typeHelp: this.userForm.value.typeHelp.id,
                description: this.userForm.value.description,
                subject: this.userForm.value.subject
            };
            this.slotService
                .bookSlot(newBooking)
                .pipe(
                    catchError((res) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Une erreur est survenue lors de la réservation du créneau',
                            life: 1000,
                            icon: 'pi pi-exclamation-triangle'
                        });
                        this.close();
                        return res;
                    }),
                    switchMap((x) => {
                        return this.orderService.getCurrentOrder();
                    }),
                    finalize(() => {
                        this.close();
                    })
                )
                .subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Réservation',
                        detail: 'Le créneau a été réservé avec succès',
                        life: 500,
                        icon: 'pi pi-thumbs-up'
                    });
                    this.onBooking.emit();
                });
        } catch (e) {
            console.error(e);
        }
    }

    unbook() {
        this.slotService
            .unbookReservationByStudent(this.appointment().extendedProps?.['slot']?.['id'])
            .pipe(
                switchMap((x) => {
                    return this.orderService.getCurrentOrder();
                }),
                catchError((res) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Une erreur est survenue lors de la suppression de la résérvation'
                    });
                    return res;
                }),
                finalize(() => {
                    this.onBooking.emit();
                    this.close();
                })
            )
            .subscribe();
    }
}
