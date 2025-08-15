import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
// import AppLoading from "expo-app-loading";
import AuthContext from "./app/auth/context";
import AuthNavigator from "./app/navigation/AuthNavigator";
import authStorage from "./app/auth/storage";
import AppContainer from "./app/screens/AppContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { InitRevenueCat } from "./app/api/revenuecatService";

SplashScreen.preventAutoHideAsync();

function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  // const restoreUser = async () => {
  //   const user = await authStorage.getUser();
  //   if (user) setUser(user);
  // };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Initializing RevenueCat...");
        await InitRevenueCat(); // Initialize RevenueCat once
        console.log("RevenueCat initialized successfully");
      } catch (error) {
        console.error("RevenueCat initialization failed:", error);
        // Don't crash the app if RevenueCat fails to initialize
        // RevenueCat features will just be unavailable
      }
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    const prepareApp = async () => {
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

    prepareApp();

  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  //useEffect;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthContext.Provider value={{ user, setUser }}>
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
