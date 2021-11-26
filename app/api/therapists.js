import apiClient from "./client";

const endpoint = '/therapists';

const getAllTherapists = () => {
    return apiClient.get(endpoint);
}

const getNearbyTherapists = (athleteRegion) => {
    return apiClient.get(endpoint + '/enabled/online/&state=' + athleteRegion);
}

export default {
    getAllTherapists,
    getNearbyTherapists,
}