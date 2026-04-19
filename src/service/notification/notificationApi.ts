import api from "../api";

export const notificationApi = {
    getAllNotification: async () => {
        return api.get('/notifications');
    },

    handleNotification: async (id: number) => {
        return api.patch(`/notifications/${id}/handled`);
    }
}   