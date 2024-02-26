import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import AuthContext from "./app/auth/context";
import AuthNavigator from "./app/navigation/AuthNavigator";
import authStorage from "./app/auth/storage";
import AppContainer from "./app/screens/AppContainer";
import {StripeProvider} from '@stripe/stripe-react-native';

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  };

  if (!isReady)
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );

  return (
    <StripeProvider
      //publishableKey="pk_live_51OnV42DyUl485VKLfkyhcQHgcBePBQOuhdxb6NcgbORvxUyTdgPnET1huRhh7Ld1ScJrLhlQcM9tgNNe7kiNVSJz00y2HjqvDc"
      publishableKey="pk_test_51OnV42DyUl485VKLZRnwkZn04TybrH3innsENQPR7WlE8MUy9Em0A5rP4TAixIG8QwoIWh031hJSPMOTtMc1cZQt00b9PAOcUb"
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
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
    </StripeProvider>

  // <AuthContext.Provider value={{ user, setUser }}>
  //   {user ? (
  //     <>
  //       <AppContainer user={user} />
  //     </>
  //   ) : (
  //     <NavigationContainer>
  //       <AuthNavigator />
  //     </NavigationContainer>
  //   )}
  // </AuthContext.Provider>
  );
}
