import apiClient from "./client";

const endpoint = "/register";

const registerAthlete = (athlete) => {
  return apiClient.post(endpoint + "/athlete", athlete);
};

const registerTherapist = (therapistObj) => {
  return apiClient.post(endpoint + "/therapist", therapistObj);
};

const deleteAccount = (id) => {
  return apiClient.delete(endpoint + "/delete/" + id);
};

export default {
  registerAthlete,
  registerTherapist,
  deleteAccount,
};
