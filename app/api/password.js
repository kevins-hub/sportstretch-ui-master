import apiClient from "./client";

const endpoint = "/password";

const forgotPassword = (email) => {
  return apiClient.put(endpoint + "/forgot-password", { email: email });
};

const resetAuth = (resetToken, authId) => {
  return apiClient.put(endpoint + "/reset-auth", {
    resetToken: resetToken,
    authId: authId,
  });
};

const resetPassword = (newPassword, authId) => {
  return apiClient.put(endpoint + "/reset-password", {
    newPassword: newPassword,
    authId: authId,
  });
};

const changePassword = (newPassword, oldPassword, authId) => {
  return apiClient.put(endpoint + "/change-password", {
    newPassword: newPassword,
    oldPassword: oldPassword,
    authId: authId,
  });
};

export default {
  forgotPassword,
  resetAuth,
  resetPassword,
  changePassword,
};
