import api from "../api";

export type MeetingType = "IN_PERSON" | "VIRTUAL";

export interface ArrangeMeetingSchedulePayload {
  meetingTitle: string;
  scheduledAt: string;
  startTime: string;
  endTime: string;
  tutorEmail: string;
  studentEmail: string[];
  meetingType: MeetingType;
  sessionColor: string;
  description?: string;
  location?: string;
  virtualPlatform: string;
  virtualPlatformLink: string;
}

export const meetingApi = {
    arrangeMeeting: async (payload: ArrangeMeetingSchedulePayload) => {
        return api.post("/meeting", payload);
    },

    getAllMeeting: async () => {
        return api.get("/meeting");
    },

    getAllStudentEmails: async (tutorId: number, email: string) => {
        return api.get(`/meeting/${tutorId}/students/emails?email=${email}`);
    }
}