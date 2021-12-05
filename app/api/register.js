import apiClient from "./client";

const endpoint = '/register';

const registerAthlete = (athlete) => {
    return apiClient.post(endpoint + '/athlete', athlete);
}

const registerTherapist = (therapistObj) => {
    return apiClient.post(endpoint + "/therapist", therapistObj);
}


export default {
    registerAthlete,
    registerTherapist
}

