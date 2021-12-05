import apiClient from "./client";

const endpoint = '/therapists';

const getAllTherapists = () => {
    return apiClient.get(endpoint);
}

const getNearbyTherapists = (athleteRegion) => {
    return apiClient.get(endpoint + '/enabled/online/?state=' + athleteRegion);
}

const setAvailability = (therapistId,statusObj) => {
    return apiClient.put(endpoint + '/setAvailability/' + therapistId, statusObj);
}

const RegisterTherapist = (therapistObj) => {
    return apiClient.post(endpoint, therapistObj);
}

export default {
    getAllTherapists,
    getNearbyTherapists,
    setAvailability
}