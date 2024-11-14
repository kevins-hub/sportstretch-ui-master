import { create } from "apisauce";
import authStorage from "../auth/storage";
import { API_URL } from "@env";

const apiClient = create({
  baseURL: process.env.API_URL ? process.env.API_URL : API_URL,
  //baseURL: "https://sportstretch-api.herokuapp.com/",
  //baseURL: 'https://localhost:3000'
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["x-auth-token"] = authToken;
});

export default apiClient;
