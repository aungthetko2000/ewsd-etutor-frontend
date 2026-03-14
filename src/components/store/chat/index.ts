import { MessageAction } from "./action";
import { MessageState, type Message } from "./state";

const state = new MessageState();
const action = new MessageAction(state);

export const messageStore = {
    state,
    getChatHistory: action.getChathistory,
    addMessage(newMsg: Message) {
        return state.messages.push(newMsg);
    },
    
    clearMessages() {
        this.state.messages = [];
    }
}