import api from "../api";

export interface CommentRequest {
    description: string,
    authorId: number,
    blogId: number |  null
    submissionId: number | null | undefined
}

export const commentApi = {
    
    getAllComments: async (id: number) => {
        return api.get(`/comments/${id}`)
    },

    getAllFeedbacks: async (id: number | null) => {
        return api.get(`/comments/submission/${id}`)
    },

    postComments: async (payload: CommentRequest) => {
        return api.post('/comments', payload);
    }
}