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

export interface MeetingNoteRequest {
    id: number,
    note: string,
}

export const MeetingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  DECLINED: "DECLINED",
} as const;

export type MeetingStatus = typeof MeetingStatus[keyof typeof MeetingStatus];

export interface MeetingConfirmationRequest {
  meetingStatus: MeetingStatus;
  reason?: string;
}

export const meetingApi = {
    arrangeMeeting: async (payload: ArrangeMeetingSchedulePayload) => {
        return api.post("/meeting", payload);
    },

    getAllMeeting: async () => {
        return api.get("/meeting");
    },

    getAllStudentEmails: async (userId: number, email: string) => {
        return api.get(`/meeting/${userId}/students/emails?email=${email}`);
    },

    updateMeetingStatus: async (meetingId: number, payload: MeetingConfirmationRequest) => {
        return api.post(`/meeting/status/${meetingId}`, payload);
    },

    saveMeeting: async (payload: MeetingNoteRequest) => {
        return api.post("/meeting/note", payload);
    },

    getMeetingNote: async (id: number) => {
        return api.get(`/meeting/note/${id}`);
    },
}