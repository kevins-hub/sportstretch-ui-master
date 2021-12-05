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

const getTherapistPastBookings = (therapistId) => {
    return apiClient.get(endpoint + `/therapist/pastBookings/?therapistId=${therapistId}`);
}

const getTherapistUpcomingBookings = (therapistId) => {
    return apiClient.get(endpoint + `/therapist/upcomingBookings/?therapistId=${therapistId}`);
}

const approveBooking = (bookingId) => {
    return apiClient.put(endpoint + '/therapist/approveBooking/' + bookingId);
}

const declineBooking = (bookingId) => {
    return apiClient.put(endpoint + '/therapist/declineBooking/' + bookingId);
}

export default {
    getAthletePastBookings,
    getAthleteUpcomingBookings,
    bookATherapist,
    getTherapistPastBookings,
    getTherapistUpcomingBookings,
    approveBooking,
    declineBooking
}