import { makeObservable } from "mobx";
import {
    staffApi,
    type TutorAllocationRequest,
} from "../../../service/staff/staffApi";
import type { StaffState } from "./state";

export class StaffAction {
    private state: StaffState;

    constructor(state: StaffState) {
        this.state = state;
        makeObservable(this);
    }

    bulkAllocateStudents = async (studentsId: number[], tutorId: number) => {
        const payload: TutorAllocationRequest = { studentsId, tutorId };

        try {
            this.state.loading = true;

            const res = await staffApi.bulkAllocateStudents(payload);
            this.state.setMessage(res.data.message);

            return res;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            this.state.loading = false;
        }
    };
}
