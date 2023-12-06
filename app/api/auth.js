import apiClient from "./client";

const endpoint = "/auth";

const login = (email, password) => apiClient.post("/auth", { email, password });

export default {
  login,
};
