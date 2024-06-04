import apiClient from "./client";

const endpoint = "/auth";

const login = (email, password) => apiClient.post("/auth", { email, password });

const refreshUser = (authId) => apiClient.post("/auth/refreshUser/" + authId);

const checkEmail = (email) => apiClient.post("/auth/checkEmail", { email });

export default {
  login,
  refreshUser,
  checkEmail
};
