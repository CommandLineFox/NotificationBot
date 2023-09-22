export interface Notification {
    channel: string;
    enabled: boolean;
    publish: boolean;
    role: string;
    last: string;
}

export interface Guild {
    id: string;
    notification?: Notification;
}
