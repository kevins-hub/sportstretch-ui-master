import apiClient from './client';

const endpoint = '/notifications';

const notifyTherapist = (therapistId, athleteFirstName) => apiClient.post(endpoint + '/notifyTherapist', { therapistId : therapistId, message : "Incoming booking request from " + athleteFirstName });

export default {
    notifyTherapist,
};