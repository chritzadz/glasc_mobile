import { Message, MessageType } from './Message';

export class MessageImpl implements Message {
    message: string;
    from: MessageType;

    constructor(message: string, from: MessageType, timestamp?: Date) {
        this.message = message;
        this.from = from;
    }

    static createBotMessage(message: string): MessageImpl {
        return new MessageImpl(message, MessageType.BOT);
    }

    static createUserMessage(message: string): MessageImpl {
        return new MessageImpl(message, MessageType.USER);
    }

    isFromBot(): boolean {
        return this.from === MessageType.BOT;
    }

    isFromUser(): boolean {
        return this.from === MessageType.USER;
    }

    toJSON(): Message {
        return {
            message: this.message,
            from: this.from
        };
    }

    static fromJSON(data: Message): MessageImpl {
        return new MessageImpl(
            data.message,
            data.from
        );
    }
}