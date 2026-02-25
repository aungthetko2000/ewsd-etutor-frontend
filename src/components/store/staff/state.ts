import { makeAutoObservable } from "mobx";

export class StaffState {

    message: string = '';
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setMessage(messge: string) {
        this.message = messge
    }

    setLoading(value: boolean) {
        this.loading = value;
    }
}