import { makeAutoObservable } from "mobx";
import type { MessageState } from "./state";
import { chatApi } from "../../../service/chat/chatApi";

export class MessageAction {

    private state: MessageState;

    constructor(state: MessageState) {
        this.state = state;
        makeAutoObservable(this);
    }

    getChathistory = async (currentUserId: number, selectedReceiverId: number) => {
        const response = await chatApi.getChathistory(currentUserId, selectedReceiverId);
        console.log('Chat Response', response.data.data)
        this.state.setMessages(response.data.data)
    }
}