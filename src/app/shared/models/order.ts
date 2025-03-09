import { BookingResponseDTO, SlotResponseDTO } from './slot';

export type OrderResponseDTO = {
    id: string;
    orderNumber: string;
    paymentDate: Date;
    createdAt: Date;
    status: EnumOrderStatus;
    paymentMethod: number;
    bookings: BookingResponseDTO[];
};
export enum EnumOrderStatus {
    pending = 0,
    paid = 1,
    canceled = 2
}
