import api from "../api";

export const studentApi = {

    getAllUnassignedStudent: async (unassigned: boolean) => {
        return api.get('/students', {
            params: {
                unassignedOnly: unassigned,
            },
        });
    }
}