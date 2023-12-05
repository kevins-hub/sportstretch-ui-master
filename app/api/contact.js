import apiClient from "./client";

const endpoint = '/contact';

const getContact = (authId) => {
    return apiClient.get(endpoint + '/get-contact/' + authId);
};

const editContact = (contactObj) => {
    return apiClient.put(endpoint + '/edit-contact/', contactObj);
}

export default {
    getContact,
    editContact
}