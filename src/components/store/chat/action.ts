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
        this.state.setMessages(response.data.data)
    }

    getChatContacts = async (userId: number) => {
        const response = await chatApi.getChatContact(userId);
        this.state.setMessageContacts(response.data.data);
    }

    getAllStudents = async (name: string) => {
        try {
            const response = await chatApi.getAllStudents(name);
            console.log('All Students from db,', response.data.data);
            this.state.setStudents(response.data.data);
        } catch (error) {
            console.error("Failed to fetch unassigned students", error);
        } finally {
            console.log("Failed")
        }
    }
}