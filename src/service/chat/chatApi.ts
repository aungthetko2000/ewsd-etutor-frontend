import api from "../api"

export const chatApi = {
    
    getChathistory: async (currentUserId: number, selectedReceiverId: number) => {
        return api.get(`/chat/history?userId1=${currentUserId}&userId2=${selectedReceiverId}`)
    },

    getChatContact: async (userId: number) => {
        return api.get(`/chat/contacts?userId=${userId}`)
    },

    getAllStudents: async (name: string) => {
        return api.get(`/chat/partner?name=${name}`);
    }
}