import apiClient from "./client";

const endpoint = '/register';

<<<<<<< Updated upstream
const registerAthlete = (athlete) => {
    return apiClient.post(endpoint + '/athlete', athlete);
}

=======
>>>>>>> Stashed changes
const registerTherapist = (therapistObj) => {
    return apiClient.post(endpoint + "/therapist", therapistObj);
}

export default {
<<<<<<< Updated upstream
    registerAthlete,
=======
>>>>>>> Stashed changes
    registerTherapist
}

