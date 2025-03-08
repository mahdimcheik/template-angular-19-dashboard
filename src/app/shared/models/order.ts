import { BookingResponseDTO, SlotResponseDTO } from './slot';

export type OrderResponseDTO = {
    id: string;
    orderNumber: number;
    paymentDate: Date;
    createdAt: Date;
    status: number;
    paymentMethod: number;
    bookings: BookingResponseDTO[];
};
