export interface Notification {
    channel: string;
    guidechannel: string;
    enabled: boolean;
    last: string;
    message: string;
    role: string;
    url: string;
    ping: string;
    publish: boolean;
    playlist: string;
    guide: boolean;
}

export interface Guild {
    id: string;
    notification?: Notification;
}
