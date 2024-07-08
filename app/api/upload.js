import apiClient from "./client";

const endpoint = "/upload";

const uploadProfilePicture = (authId, imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  return apiClient.post(endpoint + "/profile-picture/" + authId, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default {
  uploadProfilePicture,
};
