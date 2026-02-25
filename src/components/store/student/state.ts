import { makeAutoObservable } from "mobx"

export interface Student {
    id: number,
    fullName: string,
}

export class StudentState {

    students: Student[] = []
    selectedStudent: number[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    setStudents(students: Student[]) {
        this.students = students;
    }

    toggleStudent(id: number) {
        if (this.selectedStudent.includes(id)) {
            this.selectedStudent = this.selectedStudent.filter(
                (sid) => sid !== id
            );
        } else {
            this.selectedStudent.push(id);
        }
    }

    clearSelectedStudents() {
        this.selectedStudent = [];
    }
}