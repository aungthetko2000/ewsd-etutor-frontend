import api from "../api";

export const reportApi = {

    getUnassignedStudents: async () => {
        return api.get("/staffs/report/unassigned");
    },

    getInActiveReport: async (days: number) => {
        return api.get(`/staffs/students/inactive?days=${days}`);
    },
}