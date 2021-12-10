import apiClient from "./client";

const endpoint = '/therapists';

const getAllTherapists = () => {
    return apiClient.get(endpoint+'/all');
}

const getNearbyTherapists = (athleteRegion) => {
    return apiClient.get(endpoint + '/enabled/online/?state=' + athleteRegion);
}

const setAvailability = (therapistId,statusObj) => {
    return apiClient.put(endpoint + '/setAvailability/' + therapistId, statusObj);
}

const approveTherapist = (therapistId) => {
    return apiClient.put(endpoint + '/approve/' + therapistId);
}

const denyTherapist = (therapistId) => {
    return apiClient.put(endpoint + '/disable/' + therapistId);
}

const getAllRequests = () => {
    return apiClient.get(endpoint+'/requests');
}

const setToggle = (therapistId,enabled) => {
    return apiClient.put(endpoint + '/toggle/' + therapistId,enabled);
}

export default {
    getAllTherapists,
    getNearbyTherapists,
    setAvailability,
    getAllRequests,
    denyTherapist,
    approveTherapist,
    setToggle
}