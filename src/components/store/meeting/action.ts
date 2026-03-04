import { makeAutoObservable, runInAction } from "mobx";
import type { MeetingState } from "./state";
import { meetingApi, MeetingStatus, type MeetingConfirmationRequest } from "../../../service/meeting/meetingApi";

export class MeetingAction {

    private state: MeetingState;

    constructor(state: MeetingState) {
        this.state = state;
        makeAutoObservable(this);
    }

    arrangeMeetingSchedule = async () => {
        try {
            this.state.loading = true;
            const payload = this.state.createMeetingPayload();
            const res = await meetingApi.arrangeMeeting(payload)
            this.state.setMeetingSchedules([...this.state.meetingSchedules, res.data.data])
            return res;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            this.state.loading = false;
        }
    };

    getAllMeetingSchedule = async () => {
        try {
            runInAction(() => {
                this.state.loading = true;
            });

            const res = await meetingApi.getAllMeeting();

            runInAction(() => {
                this.state.setMeetingSchedules(res.data.data);
                this.state.loading = false;
            });

        } catch (err) {
            runInAction(() => {
                this.state.loading = false;
            });
            console.error(err);
            throw err;
        }
    };

    getStudentEmailByTutor = async (userId: number, email: string) => {
        const response = await meetingApi.getAllStudentEmails(userId, email);
        this.state.setSuggestion(response.data.data);
    }

    updateMeetingSatus = async (meetingId: number, payload: MeetingConfirmationRequest) => {
        const response = await meetingApi.updateMeetingStatus(meetingId, payload)
        console.log('Upate Response => ', response.data);
    }
}