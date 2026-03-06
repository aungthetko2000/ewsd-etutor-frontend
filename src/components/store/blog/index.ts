import { BlogAction } from "./action";
import { BlogState } from "./state";

const state = new BlogState();
const action = new BlogAction(state);

export const blogStore = {
    state,
    createBlog: action.createBlog,
    getAllBlog: action.getAllBlogs,
    getBlogDetailById: action.getBlogById
}