import apiClient from "./client";

const endpoint = "/bookings";

const getAthletePastBookings = (athleteId) => {
  return apiClient.get(
    endpoint + "/athlete/pastBookings/?athleteId=" + athleteId
  );
};

const getAthleteUpcomingBookings = (athleteId) => {
  return apiClient.get(
    endpoint + "/athlete/upcomingBookings/?athleteId=" + athleteId
  );
};

const athleteCancelBooking = (bookingId) => {
  return apiClient.put(endpoint + "/athlete/cancelBooking/" + bookingId);
}

const bookATherapist = (
  athleteId,
  athleteAddress,
  therapistId,
  booking_time,
  booking_date,
  hourly_rate,
  duration,
  total_cost,
  paid,
  status,
  payment_intent_id
) => {

  // convert booking date into YYYY-MM-DD format
  booking_date = booking_date.toISOString().split("T")[0];
  
  return apiClient.post(endpoint, {
    athlete_id: athleteId,
    athlete_location: athleteAddress,
    therapist_id: therapistId,
    booking_time: booking_time,
    booking_date: booking_date,
    hourly_rate: hourly_rate,
    duration: duration,
    total_cost: total_cost,
    paid: paid,
    status: status,
    payment_intent_id: payment_intent_id,
  });
};

const getTherapistPastBookings = (therapistId) => {
  return apiClient.get(
    endpoint + `/therapist/pastBookings/?therapistId=${therapistId}`
  );
};

const getTherapistUpcomingBookings = (therapistId) => {
  return apiClient.get(
    endpoint + `/therapist/upcomingBookings/?therapistId=${therapistId}`
  );
};

const getTherapistBookingsOnDate = (therapistId, date) => {
  return apiClient.get(endpoint + "/therapist/currentBookings", {
      therapistId: therapistId,
      date: date,
    },
  );
};

const therapistCancelBooking = (bookingId) => {
  return apiClient.put(endpoint + "/therapist/cancelBooking/" + bookingId);
}

const approveBooking = (bookingId) => {
  return apiClient.put(endpoint + "/therapist/approveBooking/" + bookingId);
};

const declineBooking = (bookingId) => {
  return apiClient.put(endpoint + "/therapist/declineBooking/" + bookingId);
};

const getAllBookings = () => {
  return apiClient.get(endpoint + "/all");
};
export default {
  getAthletePastBookings,
  getAthleteUpcomingBookings,
  bookATherapist,
  getTherapistPastBookings,
  getTherapistUpcomingBookings,
  getTherapistBookingsOnDate,
  approveBooking,
  declineBooking,
  getAllBookings,
  athleteCancelBooking,
  therapistCancelBooking,
};
