import { makeAutoObservable } from "mobx"

export class UserState {

    email: string = ''
    firstName: string = ''
    lastName: string = ''

    constructor() {
        makeAutoObservable(this)
    }

    setEmail(email: string) {
        this.email = email;
    }

    setFirstName(firstName: string) {
        this.firstName = firstName;
    }

    setLastName(lastName: string) {
        this.lastName = lastName;
    }
}