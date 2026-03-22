import { makeAutoObservable } from "mobx";


interface Comment {
    id: string;
    description: string;
    timeStamp: string;
    whoComment: string;
}

export class CommentState {

    comments: Comment[] = [];
    description: string = ''

    constructor() {
        makeAutoObservable(this);
    }

    setComments(comments: Comment) {
       this.comments = Array.isArray(comments) ? comments : [];
    }

    setField<K extends keyof CommentState>(key: K, value: CommentState[K]) {
        (this as CommentState)[key] = value;
    }
}
