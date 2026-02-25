import { makeObservable } from "mobx";
import { tutorApi } from "../../../service/tutor/tutorApi"
import type { TutorState } from "./state";

export class TutorAction {

    private state: TutorState;

    constructor(state: TutorState) {
        this.state = state;
        makeObservable(this);
    }

    getAllTutorList = async () => {
        this.state.loading = true;
        const response = await tutorApi.getAllTutors();
        this.state.loading = false;
        this.state.setTutors(response.data.data);
    }
}