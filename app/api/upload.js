import apiClient from "./client";

const endpoint = "/upload";

const uploadProfilePicture = (authId, image, imageFile) => {
  const formData = new FormData();
  formData.append("file", {
    uri: image,
    type: imageFile["_data"]["type"],
    name: imageFile["_data"]["name"],
  });

  return apiClient.post(endpoint + "/profile-picture/" + authId, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteProfilePicture = (authId) => {
  return apiClient.delete(endpoint + "/profile-picture/" + authId);
}

export default {
  uploadProfilePicture,
  deleteProfilePicture,
};
