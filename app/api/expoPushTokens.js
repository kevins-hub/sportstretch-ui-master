import apiClient from './client';

const endpoint = '/expoPushTokens';

const register = (pushToken) => apiClient.post(endpoint, {token: pushToken});

export default {
    register,
};