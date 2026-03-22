import { CommentAction } from "./action";
import { CommentState } from "./state";

const state = new CommentState();
const action = new CommentAction(state);

export const commentStore = {
    state,
    getAllComments: action.getAllComments,
    postComments: action.postComments
}