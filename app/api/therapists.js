import apiClient from "./client";

const endpoint = "/therapists";

const getAllTherapists = () => {
  return apiClient.get(endpoint + "/all");
};

const getTherapistsByState = (athleteRegion) => {
  return apiClient.get(endpoint + "/enabled/online/?state=" + athleteRegion);  // 2 letter state code
};

const getTherapistStates = () => {
    return apiClient.get(endpoint + "/states");
}

const setAvailability = (therapistId, statusObj) => {
  return apiClient.put(endpoint + "/setAvailability/" + therapistId, statusObj);
};

const approveTherapist = (therapistId) => {
  return apiClient.put(endpoint + "/approve/" + therapistId);
};

const denyTherapist = (therapistId) => {
  return apiClient.put(endpoint + "/disable/" + therapistId);
};

const getAllRequests = () => {
  return apiClient.get(endpoint + "/requests");
};

const setToggle = (therapistId, enabled) => {
  return apiClient.put(endpoint + "/toggle/" + therapistId, enabled);
};

const getTherapist = (therapistId) => {
  return apiClient.get(endpoint + "/" + therapistId);
}

const editTherapist = (therapistId, therapistAddressServicesObj) => {
  return apiClient.put(endpoint + "/edit/" + therapistId, therapistAddressServicesObj);
}

const editTherapistHours = (therapistId, hoursObj) => {
  businessHoursObj = {
    "businessHours": hoursObj,
  };
  businessHoursObjJSON = JSON.stringify(businessHoursObj);
  return apiClient.put(endpoint + "/edit-hours/" + therapistId, businessHoursObjJSON);
}

export default {
  getAllTherapists,
  getTherapistsByState,
  getTherapistStates,
  setAvailability,
  getAllRequests,
  denyTherapist,
  approveTherapist,
  setToggle,
  getTherapist,
  editTherapist,
  editTherapistHours,
};
