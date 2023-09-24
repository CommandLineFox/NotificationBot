export interface Notification {
    channel: string;
    enabled: boolean;
    last: string;
    message: string;
    role: string;
    url: string;
    publish: boolean;
    playlist: string;
}

export interface Guild {
    id: string;
    notification?: Notification;
}
