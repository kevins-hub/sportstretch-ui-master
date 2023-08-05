import apiClient from "./client";

const endpoint = '/password';

const forgotPassword = (email) => {
    return apiClient.put(endpoint + '/forgot-password', { email : email });
}

export default {
    forgotPassword
}