import api from "../api";

export const tutorApi = {

    getAllTutors: async () => {
        return api.get('/tutors/fetchAllTutors');
    },

    getAssignedStudents: async () => {
        return api.get('/tutors/assigned-students');
    },
}