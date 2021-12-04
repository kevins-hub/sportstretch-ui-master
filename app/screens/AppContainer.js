import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import AthleteDashboard from "./athlete/AthleteDashboard";
import TherapistDashboard from "./therapist/TherapistDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import expoPushTokensApi from "../api/expoPushTokens";

function AppContainer({ userRole }) {
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
      {userRole === "athlete" && <AthleteDashboard />}
      {userRole === "therapist" && <TherapistDashboard />}
      {userRole === "admin" && <AdminDashboard />}
    </>
  );
}

export default AppContainer;
