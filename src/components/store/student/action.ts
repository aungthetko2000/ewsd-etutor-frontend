import { makeObservable } from "mobx";
import type { StudentState } from "./state";
import { studentApi } from "../../../service/tutor/studentApi";

export class StudentAction {

    private state: StudentState;

    constructor(state: StudentState) {
        this.state = state;
        makeObservable(this);
    }

    getAllUnassignedStudents = async () => {
        const response = await studentApi.getAllUnassignedStudent(true);
        this.state.setStudents(response.data.data);
    }
}