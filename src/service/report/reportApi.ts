import api from "../api";

export const reportApi = {

    getUnassignedStudents: async () => {
        return api.get("/staffs/report/unassigned");
    },

    getInActiveReport: async (days: number) => {
        return api.get(`/staffs/students/inactive?days=${days}`);
    },

    getAverageReport: async () => {
        return api.get("/staffs/tutor-message-average");
    },

    getTotalMessageLast7Days: async () => {
        return api.get("/staffs/messages-last-7-days");
    },
}