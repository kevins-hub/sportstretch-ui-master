import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";
// import AppLoading from "expo-app-loading";
import AuthContext from "./app/auth/context";
import AuthNavigator from "./app/navigation/AuthNavigator";
import authStorage from "./app/auth/storage";
import AppContainer from "./app/screens/AppContainer";
import * as SplashScreen from "expo-splash-screen";
import {
  InitRevenueCat,
  checkProOrBasicEntitlement,
  handleLogout,
} from "./app/api/revenuecatService";
import TherapistEditSubscriptionModal from "./app/components/therapist/TherapistEditSubscriptionModal";

// SplashScreen.preventAutoHideAsync();

function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  const [revenueCatReady, setRevenueCatReady] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // First useEffect: Initialize RevenueCat
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        if (user && user.role === "therapist") {
          console.log("Initializing RevenueCat...");
          await InitRevenueCat();
          console.log("RevenueCat initialized successfully");
        } else {
          console.warn("Skipping RevenueCat initialization for athlete or no user");
        }
      } catch (error) {
        console.error("RevenueCat initialization failed:", error);
        // Don't crash the app if RevenueCat fails to initialize
        // This is especially important in production
        console.log("Continuing without RevenueCat to prevent app hanging");
      } finally {
        // Always set RevenueCat as ready, regardless of success/failure
        setIsReady(true)
        setRevenueCatReady(true);
      }
    };
    initializeRevenueCat();
  }, []);

  // Second useEffect: Load user from storage
  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       console.log("Loading user from storage...");
  //       const user = await authStorage.getUser();
  //       if (user) {
  //         console.log("User found:", user.id || "Unknown ID");
  //         setUser(user);
  //       } else {
  //         console.log("No user found in storage");
  //         setUser(null); // Explicitly set to null if no user
  //       }
  //     } catch (error) {
  //       console.error("Failed to load user from storage:", error);
  //       setUser(null); // Set to null on error to ensure app continues
  //     } finally {
  //       setIsReady(true);
  //       console.log("Splash screen hidden successfully");
  //     }
  //   };
  //   loadUser();
  // }, []);

  //useEffect;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContext.Provider value={{ user, setUser }}>
        {user && user.role === "therapist" && showSubscriptionModal && (
          <TherapistEditSubscriptionModal
            visible={showSubscriptionModal}
            setVisibility={setShowSubscriptionModal}
            onClose={() => setShowSubscriptionModal(false)}
            isSignUp={true}
            inactiveSubscription={true}
          />
        )}
        {user ? (
          <>
            <AppContainer user={user} />
          </>
        ) : (
          <NavigationContainer>
            <AuthNavigator />
          </NavigationContainer>
        )}
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}

export default App;
