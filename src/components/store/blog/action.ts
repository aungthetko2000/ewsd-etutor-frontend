import { makeAutoObservable } from "mobx";
import type { BlogState } from "./state";
import { blogApi } from "../../../service/blog/blogApi";

export class BlogAction {

    private state: BlogState;

    constructor(state: BlogState) {
        this.state = state;
        makeAutoObservable(this);
    }

    createBlog = async () => {
        try {
            const formData = new FormData();

            formData.append("title", this.state.title);
            formData.append("content", this.state.content);

            if (this.state.image) {
                formData.append("image", this.state.image);
            }
            this.state.loading = true;
            const response = await blogApi.createNewBlog(formData);
            this.state.setMessage(response.data.message)
            this.state.loading = false;
        } catch (err) {
            console.log(err)
        } finally {
            this.state.loading = false
        }
    }

    getAllBlogs = async () => {
        try {
            this.state.loading = true
            const response = await blogApi.getAllBlogs();
            this.state.setBlogs(response.data.data)
            this.state.loading = false
        } catch (err) {
            console.log(err)
        } finally {
            this.state.loading = false
        }
    }

    getBlogById = async (id: number) => {
        try {
            this.state.loading = true
            const response = await blogApi.getAllBlogById(id);
            console.log(response.data.data)
            this.state.setBlogDetail(response.data.data);
            this.state.loading = false;
        } catch (err) {
            console.log(err)
        } finally {
            this.state.loading = false
        }
    }
}