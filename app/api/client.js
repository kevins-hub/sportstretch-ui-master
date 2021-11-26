import {create} from 'apisauce';

const apiClient = create({
    baseURL: 'https://sportstretch-api.herokuapp.com/',
});

export default apiClient;