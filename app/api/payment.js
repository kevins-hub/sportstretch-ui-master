import apiClient from "./client";

const endpoint = "/payment";

const createPaymentIntent = (paymentObj) => {
  return apiClient.post(endpoint + "/create-payment-intent", paymentObj);
};

export default {
    createPaymentIntent
};
