import apiClient from "./client";

const endpoint = '/bookings';

const getAthletePastBookings = (athleteId) => {
    return apiClient.get(endpoint + '/athlete/pastBookings/?athleteId=' + athleteId);
}

const getAthleteUpcomingBookings = (athleteId) => {
    return apiClient.get(endpoint + '/athlete/upcomingBookings/?athleteId=' + athleteId);
}

const bookATherapist = (athleteId, athleteAddress, therapistId) => {
    return apiClient.post(endpoint, {"athlete_id": athleteId, "athlete_location": athleteAddress, "therapist_id": therapistId});
}

export default {
    getAthletePastBookings,
    getAthleteUpcomingBookings,
    bookATherapist,
}