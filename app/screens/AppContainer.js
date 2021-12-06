import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import AthleteDashboard from "./athlete/AthleteDashboard";
import TherapistDashboard from "./therapist/TherapistDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import expoPushTokensApi from "../api/expoPushTokens";
import TherapistRegistrationPending from './therapist/TherapistRegistrationPending';
import TherapistDisabled from './therapist/TherapistDisabledScreen';

function AppContainer({ user }) {
    useEffect(() => {
        registerForPushNotification();
    }, []);
    
  const registerForPushNotification = async () => {
    try {
        if (Constants.isDevice) {
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== "granted") {
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          expoPushTokensApi.register(token);
          //console.log(token);
        }       
    } catch (error) {
        console.log('Error getting push notification token', error);
    }
  };

  return (
    <>
      {user.role === "athlete" && <AthleteDashboard />}
      {user.role === "therapist" && ((user.userObj.enabled === -1 && <TherapistRegistrationPending/>) || (user.userObj.enabled === 0 && <TherapistDisabled/>) || <TherapistDashboard/>)}
      {user.role === "admin" && <AdminDashboard />}
    </>
  );
}

export default AppContainer;
