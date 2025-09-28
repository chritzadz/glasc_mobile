export enum MessageType {
    BOT = "bot",
    USER = "user"
}

export interface Message{
    message: string;
    from: MessageType;
}