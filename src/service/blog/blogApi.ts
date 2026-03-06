import api from "../api";

export interface CreateBlogPayload {
    title: string;
    content: string;
    image: File;
}

export const blogApi = {
    
    createNewBlog: async (formData: FormData) => {
        return api.post("/blogs", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },

    getAllBlogs: async () => {
        return api.get("/blogs");
    },

    getAllBlogById: async (id: number) => {
        return api.get(`/blogs/${id}`);
    }
}