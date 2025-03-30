export type NotificationApp = {
    id: string;
    description?: string;
    createAt: Date;
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
