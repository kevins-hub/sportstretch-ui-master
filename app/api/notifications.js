import apiClient from './client';

const endpoint = '/notifications';

const notifyTherapist = (therapistId, athleteFirstName) => apiClient.post(endpoint + '/notifyTherapist', { therapistId : therapistId, message : "Incoming booking request from " + athleteFirstName });

const notifyAthlete = (athleteId, booking_id) => apiClient.post(endpoint + '/notifyAthlete', { athleteId : athleteId, message : "Your appointment status has been changed for booking Id: " + booking_id });

export default {
    notifyTherapist,
    notifyAthlete
};