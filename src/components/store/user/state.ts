import { makeAutoObservable } from "mobx";

export class UserState {

    email: string = '';
    fullName: string = '';

    constructor() {
        makeAutoObservable(this)
    }

    setEmail(email: string) {
        this.email = email;
    }

    setFullName(fullName: string) {
        this.fullName = fullName;
    }
}