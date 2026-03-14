import { makeAutoObservable } from "mobx"

export interface Message {
    senderEmail: string;
    receiverEmail: string;
    content: string;
    timestamp?: string;
}

export class MessageState {
    messages: Message[] = []

    constructor() {
        makeAutoObservable(this);
    }

    setMessages(messages: Message[]) {
        this.messages = messages
    }
}