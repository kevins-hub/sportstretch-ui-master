import apiClient from "./client";

const endpoint = "/upload";

const uploadProfilePicture = (authId, image, imageFile) => {
  const formData = new FormData();
  formData.append("file", {
    uri: image,
    type: imageFile["_data"]["type"],
    name: imageFile["_data"]["name"],
  });

  console.warn("uploading file: ", imageFile);
//   console.warn("formData: ", formData.get("file"));
  console.warn("formData = ", formData);

  return apiClient.post(endpoint + "/profile-picture/" + authId, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  uploadProfilePicture,
};
