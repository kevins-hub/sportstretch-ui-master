import React, { useEffect, useState, useContext } from "react";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AthleteDashboard from "./athlete/AthleteDashboard";
import TherapistDashboard from "./therapist/TherapistDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import expoPushTokensApi from "../api/expoPushTokens";
import TherapistRegistrationPending from "./therapist/TherapistRegistrationPending";
import TherapistDisabled from "./therapist/TherapistDisabledScreen";
import AppNavigator from "../navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { checkProOrBasicEntitlement, handleLogout } from "../api/revenuecatService";
import TherapistEditSubscriptionModal from "../components/therapist/TherapistEditSubscriptionModal";
import AuthContext from "../auth/context";


export default function AppContainer({ user }) {

  const authContext = useContext(AuthContext);

  useEffect(() => {
    registerForPushNotification();
    if (user.role === "therapist") {
      checkIfEntitlementExists();
    }
  }, []);

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false); 

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
      console.log("Error getting push notification token", error);
    }
  };

  const checkIfEntitlementExists = async () => {
    const hasEntitlement = await checkProOrBasicEntitlement();
    if (!hasEntitlement) {
      console.log("User does not have Pro or Basic entitlement");
      // Handle the case where the user does not have the entitlement
      // Show alert, with options to subscribe or Log out
      Alert.alert("Subscription Required", "We have detected that you don't have an active subscription, please subscribe to continue using the app or contact support if you think this is a mistake.", [
        {
          text: "Subscribe",
          onPress: () => {
            // Show subscription modal
            setShowSubscriptionModal(true);
          },
        },
        {
          text: "Log Out",
          onPress: () => {
            // Log out user
            handleLogout();
            authContext.setUser(null);
          },
        },
      ]);
    } else {
      console.log("User has Pro or Basic entitlement");
      // Handle the case where the user has the entitlement
    }
  }

  

  return (
    <>
      {/* {user.role === "athlete" && <AthleteDashboard />} */}
      {/* {user.role === "therapist" && ((user.userObj.enabled === -1 && <TherapistRegistrationPending/>) || (user.userObj.enabled === 0 && <TherapistDisabled/>) || <TherapistDashboard/>)} */}
      {user.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <>
        <TherapistEditSubscriptionModal
          visible={showSubscriptionModal}
          setVisibility={setShowSubscriptionModal}
          onClose = {() => setShowSubscriptionModal(false)}
          isSignUp={true}
        />
        <NavigationContainer
          linking={{
            prefixes: ["sportstretch://", "https://sportstretch.com"],
            config: {
              screens: {
                Profile: "profile",
                // Add other screens and paths as needed
              },
            },
          }}
        >
          <AppNavigator user={user} />
        </NavigationContainer>
        </>
      )}
    </>
  );
}

// export default AppContainer;
