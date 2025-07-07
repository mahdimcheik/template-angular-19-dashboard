import { BookingResponseDTO, SlotResponseDTO } from './slot';

export type OrderResponseDTO = {
    id: string;
    orderNumber: string;
    paymentDate: Date;
    createdAt: Date;
    status: EnumOrderStatus;
    paymentMethod: number;
    totalDiscountedPrice: number;
    totalOriginalPrice: number;
    totalReduction: number;
    bookings: BookingResponseDTO[];
    leftTimeToPay: TimeSpanDTO;
};
export enum EnumOrderStatus {
    pending = 0,
    paid = 1,
    canceled = 2
}

export type TimeSpanDTO = {
    minutes: number;
    seconds: number;
};

export type CheckoutRequest = {
    orderId: string;
    amout?: number;
    itemName?: string;
};

export type CheckoutResponse = {
    sessionId: string;
    url: string;
};
