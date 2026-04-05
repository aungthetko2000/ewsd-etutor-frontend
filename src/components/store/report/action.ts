import { makeAutoObservable } from "mobx";
import type { ExceptionReportState } from "./state";
import { reportApi } from "../../../service/report/reportApi";

export class ExceptionReportAction {
    
    private state: ExceptionReportState;

    constructor(state: ExceptionReportState) {
        this.state = state;
        makeAutoObservable(this);
    }

    getAllUnAssignedStudent = async () => {
        try {
            this.state.loading = true
            const response = await reportApi.getUnassignedStudents();
            console.log('Unassigned Student', response.data.data);
            this.state.setUnAssignedStudent(response.data.data);
        } catch (error) {
            console.error(error)
        } finally {
            this.state.loading = false
        }
    }

}
