import api from "../api";

export interface TutorAllocationRequest {
    studentsId: number[];
    tutorId: number;
}

export const staffApi = {
    bulkAllocateStudents: async (payload: TutorAllocationRequest) => {
        return api.post("/staffs/bulk-allocate", payload);
    }
}