import { MeetingAction } from "./action";
import { MeetingState } from "./state";

const state = new MeetingState();
const action = new MeetingAction(state);

export const meetingStore = {
    state,
    arrangeMeeting: action.arrangeMeetingSchedule,
    gtAllMeetingSchedule: action.getAllMeetingSchedule,
    getAllStudentEmail: action.getStudentEmailByTutor
}