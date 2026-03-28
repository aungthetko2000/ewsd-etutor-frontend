import { makeAutoObservable } from "mobx";
import type { CommentState } from "./state";
import { commentApi, type CommentRequest } from "../../../service/comment/commentApi";

export class CommentAction {

    private state: CommentState;

    constructor(state: CommentState) {
        this.state = state;
        makeAutoObservable(this);
    }

    getAllComments = async (blogId: number) => {
        try {
            const response = await commentApi.getAllComments(blogId);
            this.state.setComments(response.data.data);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            console.error('finally')
        }
    };

    postComments = async (data: CommentRequest) => {
        try {
            const response = await commentApi.postComments(data);
            this.state.setComments(response.data.data.description);
            this.state.description = ''
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}