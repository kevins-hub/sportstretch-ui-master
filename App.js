import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";
// import AppLoading from "expo-app-loading";
import AuthContext from "./app/auth/context";
import AuthNavigator from "./app/navigation/AuthNavigator";
import authStorage from "./app/auth/storage";
import AppContainer from "./app/screens/AppContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import {
  InitRevenueCat,
  checkProOrBasicEntitlement,
  handleLogout,
} from "./app/api/revenuecatService";
import TherapistEditSubscriptionModal from "./app/components/therapist/TherapistEditSubscriptionModal";
import ErrorBoundary from "./app/components/shared/ErrorBoundary";

SplashScreen.preventAutoHideAsync();

function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  const [revenueCatReady, setRevenueCatReady] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // const restoreUser = async () => {
  //   const user = await authStorage.getUser();
  //   if (user) setUser(user);
  // };

  // First useEffect: Initialize RevenueCat
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        if (user && user.role === "therapist") {
          console.log("Initializing RevenueCat...");
          await InitRevenueCat();
          console.log("RevenueCat initialized successfully");
          setRevenueCatReady(true);
          return;
        } else {
          console.warn("Skipping RevenueCat initialization for athlete");
          setRevenueCatReady(true);
          return
        }
      } catch (error) {
        console.error("RevenueCat initialization failed:", error);
        // Don't crash the app if RevenueCat fails to initialize
        // This is especially important in production
        console.log("Continuing without RevenueCat to prevent app hanging");
        setRevenueCatReady(true); // Continue anyway
      }
    };

    // Add timeout failsafe for RevenueCat initialization
    const initTimeout = setTimeout(() => {
      console.warn(
        "RevenueCat initialization taking too long, force continuing..."
      );
      setRevenueCatReady(true);
    }, 20000); // 20 second failsafe

    initializeRevenueCat().finally(() => {
      clearTimeout(initTimeout);
    });

    return () => clearTimeout(initTimeout);
  }, [user]);

  // Second useEffect: Load user from storage
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("Loading user from storage...");
        const user = await authStorage.getUser();
        if (user) {
          console.log("User found:", user.id || "Unknown ID");
          setUser(user);
        } else {
          console.log("No user found in storage");
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
      } finally {
        setIsReady(true);
      }
    };

    loadUser();
  }, []);

  // Third useEffect: Check subscription ONLY after RevenueCat is ready AND user is loaded
  useEffect(() => {
    if (revenueCatReady && user && user.role === "therapist") {
      console.log(
        "RevenueCat ready and therapist user loaded, checking subscription..."
      );
      // checkIfEntitlementExists();
    }
  }, [revenueCatReady, user]);

  const checkIfEntitlementExists = async () => {
    try {
      console.warn("Checking user entitlements...");
      const hasEntitlement = await checkProOrBasicEntitlement();
      if (!hasEntitlement) {
        console.warn("User does not have Pro or Basic entitlement");
        // Show alert with options to subscribe or Log out
        Alert.alert(
          "Subscription Required",
          "We have detected that you don't have an active subscription, please subscribe to continue using the app or contact support if you think this is a mistake. If you are using a different Apple ID, please sign out and sign in with the correct Apple ID.",
          [
            {
              text: "Subscribe",
              onPress: () => {
                setShowSubscriptionModal(true);
              },
            },
            {
              text: "Log Out",
              onPress: () => {
                handleLogout();
                setUser(null);
              },
            },
          ]
        );
      } else {
        console.log("User has Pro or Basic entitlement");
      }
    } catch (error) {
      console.error("Error checking entitlements:", error);
      // Don't show alerts for entitlement errors in production
      // Just log and continue - user can still use the app
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (isReady && revenueCatReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady, revenueCatReady]);

  if (!isReady || !revenueCatReady) {
    return null;
  }

  //useEffect;

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthContext.Provider value={{ user, setUser }}>
          {user && user.role === "therapist" && showSubscriptionModal? (
            <TherapistEditSubscriptionModal
              visible={showSubscriptionModal}
              setVisibility={setShowSubscriptionModal}
              onClose={() => setShowSubscriptionModal(false)}
              isSignUp={true}
              inactiveSubscription={true}
            />
          ) : (
            <></>
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
    </ErrorBoundary>
  );
}

export default App;
