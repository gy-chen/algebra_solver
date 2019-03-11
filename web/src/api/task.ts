import axios from 'axios';

const client = axios.create({
    // TODO read baseURL from env
    baseURL: 'http://127.0.0.1:5000'
});

export const createTask = (content: string) => {
    return client.post('/task', {
        content
    });
};

export const pollTask = (id: string) => {
    // TODO return observable that emit task data
};