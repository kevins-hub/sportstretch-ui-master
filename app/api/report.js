import apiClient from "./client";

const endpoint = "/report";

const reportIssue = (reportIssueObj) => {
  return apiClient.post(endpoint + "/reportIssue", reportIssueObj);
};

export default {
  reportIssue,
};
