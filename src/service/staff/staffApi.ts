import api from "../api";

export interface TutorAllocationRequest {
    studentsId: number[];
    tutorId: number;
}

export type Student = {
  firstName: string;
  lastName: string;
  fatherName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  emergencyContact: string;
  session: string;
  address: string;
  course: string;
  registrationDate: string;
};

export const staffApi = {

    bulkAllocateStudents: async (payload: TutorAllocationRequest) => {
        return api.post("/staffs/bulk-allocate", payload);
    },
    
    getAllAllocationList: async () => {
        return api.get("/staffs/allocations");
    },

    registerStudent: async (payload: Student) => {
        return api.post("/staffs/register", payload);
    },
}