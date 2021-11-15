import apiClient from "./client";

const endpoint = '/users';

const getAllTherapists = () => {
    return apiClient.get(endpoint);
}

const getNearbyTherapists = (athleteRegion) => {
    return apiClient.get(endpoint);
    //apiClient.get(endpoint + '&state=' + athleteRegion);
}

export default {
    getAllTherapists,
    getNearbyTherapists,
}