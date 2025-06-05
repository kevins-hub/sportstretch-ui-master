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
    InitRevenueCat(); // Initialize RevenueCat once
  }, []);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const user = await authStorage.getUser();
        if (user) setUser(user);
      } catch (error) {
        console.warn(error);
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

  useEffect;

  // if (!isReady)
  //   return (
  //     // <AppLoading
  //     //   startAsync={restoreUser}
  //     //   onFinish={() => setIsReady(true)}
  //     //   onError={console.warn}
  //     // />
  //   );

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
