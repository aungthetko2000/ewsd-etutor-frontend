import { makeAutoObservable, runInAction } from "mobx";
import type { MeetingState } from "./state";
import {
    meetingApi,
    type MeetingConfirmationRequest,
} from "../../../service/meeting/meetingApi";

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
            const res = await meetingApi.arrangeMeeting(payload);
            console.log("CREATE response:", res.data.data);
            runInAction(() => {
                this.state.meetingSchedules.push(res.data.data);
            });
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
    };

    updateMeetingSatus = async (
        meetingId: number,
        payload: MeetingConfirmationRequest,
    ) => {
        try {
            this.state.loading = true;
            await meetingApi.updateMeetingStatus(meetingId, payload);
        } catch (err) {
            this.state.loading = false;
            console.log(err);
        } finally {
            this.state.loading = false;
        }
    };
}
