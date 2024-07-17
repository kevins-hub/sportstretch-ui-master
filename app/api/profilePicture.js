import apiClient from "./client";

const endpoint = "/profilePicture";

const getProfilePicutre = (authId) => {
  return apiClient.get(endpoint + "/" + authId);
};

export default {
    getProfilePicutre,
};
