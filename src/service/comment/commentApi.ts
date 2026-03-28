import api from "../api";

export interface CommentRequest {
    description: string,
    authorId: number,
    blogId: number
}

export const commentApi = {
    
    getAllComments: async (blogId: number) => {
        return api.get(`/comments/${blogId}`)
    },

    postComments: async (payload: CommentRequest) => {
        return api.post('/comments', payload);
    }
}