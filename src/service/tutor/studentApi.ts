import api from "../api";

export const studentApi = {

    getAllUnassignedStudent: async (unassigned: boolean) => {
        return api.get('/students', {
            params: {
                unassignedOnly: unassigned,
            },
        });
    },

    getAllAssignedStudent: async (tutorId: number) => {
        return api.get(`/students/assigned?tutorId=${tutorId}`);
    }
}