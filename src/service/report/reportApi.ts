import api from "../api";

export const reportApi = {

    getUnassignedStudents: async () => {
        return api.get("/staffs/report/unassigned");
    }
}