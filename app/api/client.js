import {create} from 'apisauce';

const apiClient = create({
    baseURL: 'https://jsonplaceholder.typicode.com/',
});

export default apiClient;