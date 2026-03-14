import api from "../api"

export const chatApi = {
    
    getChathistory: async (currentUserId: number, selectedReceiverId: number) => {
        return api.get(`/chat/history?userId1=${currentUserId}&userId2=${selectedReceiverId}`)
    }
}