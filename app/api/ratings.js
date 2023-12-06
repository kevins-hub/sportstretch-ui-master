import apiClient from "./client";

const endpoint = "/ratings";

const updateRating = (bookingId, ratingObj) => {
  return apiClient.put(endpoint + "/" + bookingId, ratingObj);
};

const rateBooking = (ratingObj) => {
  return apiClient.post(endpoint, ratingObj);
};

export default {
  updateRating,
  rateBooking,
};
