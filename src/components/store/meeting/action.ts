import { makeAutoObservable, runInAction } from "mobx";
import type { MeetingState } from "./state";
import { meetingApi } from "../../../service/meeting/meetingApi";

export class MeetingAction {

    private state: MeetingState;

    constructor(state: MeetingState) {
        this.state = state;
        makeAutoObservable(this);
    }

    arrangeMeetingSchedule = async () => {
        try {
            const payload = this.state.createMeetingPayload();
            const res = await meetingApi.arrangeMeeting(payload)
            console.log('Response', res.data.data)
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

    getStudentEmailByTutor = async (tutorId: number, email: string) => {
        const response = await meetingApi.getAllStudentEmails(tutorId, email);
        this.state.setSuggestion(response.data.data);
    }
}