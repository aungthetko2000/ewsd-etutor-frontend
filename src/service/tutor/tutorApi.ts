import api from "../api";

export const tutorApi = {

    getAllTutors: async () => {
        return api.get('/tutors/fetchAllTutors');
    },
}