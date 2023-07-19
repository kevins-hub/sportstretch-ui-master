import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import AuthContext from './app/auth/context';
import AuthNavigator from './app/navigation/AuthNavigator';
import authStorage from './app/auth/storage';
import AppContainer from './app/screens/AppContainer';
import LogOutButton from './app/components/shared/LogOutButton';
import ChangePasswordButton from './app/components/shared/ChangePasswordButton';

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  }


  if (!isReady)
    return <AppLoading startAsync={restoreUser} onFinish={() => setIsReady(true)} onError={console.warn} />

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {user ? <><AppContainer user={user} /><LogOutButton></LogOutButton><ChangePasswordButton></ChangePasswordButton></> : <NavigationContainer><AuthNavigator/></NavigationContainer>}
    </AuthContext.Provider>
  );
}
