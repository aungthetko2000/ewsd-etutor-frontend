import { makeAutoObservable } from "mobx"

export interface Tutor {
    id: number,
    fullName: string,
    email: string,
    expertise: string
}

export class TutorState {

    tutors: Tutor[] = []
    selectedTutor: Tutor | null = null;
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    setTutors(tutors: Tutor[]) {
        this.tutors = tutors;
    }

    selectTutor(tutor: Tutor) {
        this.selectedTutor = tutor;
    }

    clearSelectedTutor() {
        this.selectedTutor = null;
    }
}