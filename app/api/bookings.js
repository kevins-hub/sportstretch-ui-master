import apiClient from "./client";

const endpoint = '/bookings';

const getAthletePastBookings = (athleteId) => {
    return apiClient.get(endpoint + '/athlete/pastBookings/?athleteId=' + athleteId);
}

const getAthleteUpcomingBookings = (athleteId) => {
    return apiClient.get(endpoint + '/athlete/upcomingBookings/?athleteId=' + athleteId);
}

export default {
    getAthletePastBookings,
    getAthleteUpcomingBookings
}