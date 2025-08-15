import { create } from "apisauce";
import authStorage from "../auth/storage";
import { API_URL } from "@env";

const apiClient = create({
  baseURL: process.env.API_URL ? process.env.API_URL : API_URL,
  //baseURL: "https://sportstretch-api.herokuapp.com/",
  //baseURL: 'https://localhost:3000'
});

apiClient.addAsyncRequestTransform(async (request) => {
  try {
    const authToken = await authStorage.getToken();
    if (!authToken) return;
    request.headers["x-auth-token"] = authToken;
  } catch (error) {
    console.error("Failed to get auth token:", error);
    // Don't crash if auth token retrieval fails
  }
});

// Add response transform to handle common errors
apiClient.addResponseTransform((response) => {
  if (!response.ok) {
    console.log("API Error:", {
      status: response.status,
      problem: response.problem,
      url: response.config?.url,
      data: response.data,
    });
  }
});

export default apiClient;
