import apiClient from "./client";

const endpoint = '/register';

const registerAthlete = (athlete) => {
    return apiClient.post(endpoint + '/athlete', athlete);
}

export default {
    registerAthlete,
}