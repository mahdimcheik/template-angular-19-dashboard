export type NotificationApp = {
    id: string;
    description?: string;
    createdAt: Date;
    url?: string;
    isRead: boolean;
    senderId?: string;
    RecipientId?: string;
    type: number;
    bookingId?: string;
    orderId?: string;
};

export type NotificationFilter = {
    isRead?: boolean;
    offset?: number;
    perPage?: number;
};

export enum EnumTypeNotification {
    // Account related
    AccountConfirmed = 0,
    PasswordChanged = 1,
    AccountUpdated = 2,
    PasswordResetDemandAccepted = 3,

    // Reservation related
    ReservationAccepted = 10,
    ReservationRejected = 11,
    ReservationCancelled = 12,
    ReservationCancelledTimeOut = 13,
    ReservationReminder = 14,
    NewReservation = 15,

    // Payment related
    PaymentAccepted = 20,
    PaymentFailed = 21,
    RefundProcessed = 22,

    // Teacher/Student interaction
    MessageReceived = 30,
    ReviewReceived = 31,
    NewAnnouncement = 32,

    // General notifications
    SystemUpdate = 40,
    PromotionOffer = 41,
    GeneralReminder = 42
}
