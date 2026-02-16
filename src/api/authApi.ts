import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface LoginResponse {
    token: string;
    user: any;
}

export const loginApi = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const response = await api.post('/login', {
        email,
        password,
    });

    return response.data;
};
