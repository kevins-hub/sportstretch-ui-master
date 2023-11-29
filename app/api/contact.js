import apiClient from "./client";

const endpoint = '/contact';

const getContact = (authId) => {
    return apiClient.get(endpoint + '/get-contact/' + authId);
};

export default {
    getContact
}