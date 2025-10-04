import { useEffect, useContext } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AdminDashboard from "./admin/AdminDashboard";
import expoPushTokensApi from "../api/expoPushTokens";
import AppNavigator from "../navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AuthContext from "../auth/context";


export default function AppContainer({ user }) {

  const authContext = useContext(AuthContext);

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
      console.log("Error getting push notification token", error);
    }
  };

  

  return (
    <>
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
        {user.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <AppNavigator user={user} />
        )}
      </NavigationContainer>
    </>
  );
}

// export default AppContainer;
