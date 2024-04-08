import apiClient from "./client";

const endpoint = "/auth";

const login = (email, password) => apiClient.post("/auth", { email, password });

const refreshUser = (authId) => apiClient.post("/auth/refreshUser/" + authId);

export default {
  login,
  refreshUser,
};
