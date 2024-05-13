import apiClient from "./client";

const endpoint = "/payment";

const createPaymentIntent = (paymentObj) => {
  return apiClient.post(endpoint + "/create-payment-intent", paymentObj);
};

const registerStripeAccount = (stripeObj) => {
  return apiClient.post(endpoint + "/register-stripe-account", stripeObj);
}

const generateStripeLoginLink = (therapistId) => {
  return apiClient.get(endpoint + "/generate-stripe-login-link/" + therapistId);
}

const getStripeOnboardLink = (therapistId) => {
  return apiClient.get(endpoint + "/get-onboard-link/" + therapistId);
}

const getStripeAccount = (therapistId) => {
  return apiClient.get(endpoint + "/retrieve-stripe-account/" + therapistId);
}

export default {
    createPaymentIntent,
    registerStripeAccount,
    generateStripeLoginLink,
    getStripeOnboardLink,
    getStripeAccount,
};
