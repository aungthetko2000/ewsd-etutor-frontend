import api from "../api";


export interface Student {
  id: number;
  fullName: string;
  email: string;
  age: number;
  grade: string;
  assigned: boolean;
  currentTutorId?: number;
}


export const studentApi = {

  getStudents: async (unassignedOnly?: boolean) => {
    return api.get("/students", {
      params: { unassignedOnly }
    });
  },

  registerStudent: async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age: number;
    grade: string;
  }) => {
    return api.post("/students/register", payload);
  }

};