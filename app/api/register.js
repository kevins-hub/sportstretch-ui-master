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

const checkPhone = (phone) => {
  return apiClient.post(endpoint + "/checkPhone", { phone });
}
const verifyEmail = (verifyEmailObj) => {
  return apiClient.post(endpoint + "/verify-email", verifyEmailObj);
};

export default {
  registerAthlete,
  registerTherapist,
  deleteAccount,
  checkPhone,
  verifyEmail,
};
