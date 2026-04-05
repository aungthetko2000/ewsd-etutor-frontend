import { makeAutoObservable } from "mobx";

export type Student = {
  id: number;
  fullName: string;
  currentTutorId: number | null;
  assigned: boolean;
  email: string;
  age: number;
  session: string;
  phone: string;
  address: string;
  status: string;
  course: string;
  registrationDate: string;
};

export class ExceptionReportState {

    reportType: string = ""
    inactiveRange: string = ""
    unAssignedStudent: Student[] = []
    loading: boolean = false

    constructor() {
        makeAutoObservable(this);
    }

    setReportType(reportType: string) {
        this.reportType = reportType;
    }

    setInActiveRange(inactiveRange: string) {
        this.inactiveRange = inactiveRange;
    }

    setUnAssignedStudent(unAssignedStudent: Student[]) {
        this.unAssignedStudent = unAssignedStudent;
    }

    setLoading(loading: boolean) {
        this.loading = loading
    }
}