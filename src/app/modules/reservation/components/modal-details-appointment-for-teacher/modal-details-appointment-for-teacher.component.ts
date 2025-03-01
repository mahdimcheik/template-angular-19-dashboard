import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EventInput } from '@fullcalendar/core/index.js';
import { SlotService } from '../../../../shared/services/slot.service';
import { SlotCreateDTO, SlotUpdateDTO } from '../../../../shared/models/slot';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-modal-details-appointment-for-teacher',
    standalone: false,

    templateUrl: './modal-details-appointment-for-teacher.component.html',
    styleUrl: './modal-details-appointment-for-teacher.component.scss'
})
export class ModalDetailsAppointmentForTeacherComponent {
    @Input() visible: boolean = false;
    @Output() actionEmitter = new EventEmitter<boolean>(false);
    @Input({ required: true }) appoitment: EventInput = {
        // appointment to change
        start: new Date(),
        end: new Date(),
        extendedProps: {}
    };
    @Input() newSlot: EventInput = {
        // new slot place , when we drag and drop mofo
        start: new Date(),
        end: new Date()
    };
    @Input() isCreateModal: boolean = false;
    start!: Date;
    end!: Date;
    price: number = 15;
    reduction: number = 0;
    isInThePast: boolean = false;
    slotService = inject(SlotService);
    visibleEvents = this.slotService.visibleEvents;

    ngOnInit(): void {
        this.start = this.newSlot.start as Date;
        this.end = this.newSlot.end as Date;
        this.reduction = this.isCreateModal ? 0 : (this.appoitment.extendedProps?.['reduction'] ?? 0);
        this.price = this.isCreateModal ? 15 : (this.appoitment.extendedProps?.['price'] ?? 15);
        this.isInThePast = new Date() > this.start;
    }
    cancel(shouldRelaod: boolean = false) {
        this.actionEmitter.emit(shouldRelaod);
        this.slotService.visibleEvents.set([...this.slotService.visibleEvents()]);
    }
    validate() {
        if (this.isCreateModal) {
            if (this.price < 0 || this.price > 200 || this.reduction < 0 || this.reduction > 100) return;
            const newAppoitment = {
                startAt: this.start,
                endAt: this.end,
                createdAt: new Date(),
                price: this.price,
                reduction: this.reduction,
                type: 0
            };
            this.slotService.addSlotByCreator(newAppoitment as SlotCreateDTO).subscribe();
            this.cancel();
        } else if (this.appoitment.extendedProps?.['studentId']) {
            this.slotService
                .unbookReservationByTeacher(this.appoitment.extendedProps?.['id'])
                .pipe(finalize(() => this.cancel(true)))
                .subscribe();
        } else {
            this.slotService
                .deleteSlotByCreator(this.appoitment.extendedProps?.['slot']?.['id'])
                .pipe(finalize(() => this.cancel(true)))
                .subscribe();
        }
    }

    update() {
        const slotUpdateDTO: SlotUpdateDTO = {
            id: this.appoitment.extendedProps?.['id'],
            startAt: this.start,
            endAt: this.end,
            createdAt: new Date(),
            price: this.price,
            reduction: this.reduction,
            type: this.appoitment.extendedProps?.['type'] ?? 0
        };
        this.slotService
            .updateSlotByCreator(slotUpdateDTO)
            .pipe(finalize(() => this.cancel(true)))
            .subscribe();
    }
}
