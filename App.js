import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppLoading } from 'expo';

import AuthContext from './app/auth/context';
import AthleteDashboard from './app/screens/athlete/AthleteDashboard';
import TherapistDashboard from './app/screens/therapist/TherapistDashboard';
import AdminDashboard from './app/screens/admin/AdminDashboard';
import AuthNavigator from './app/navigation/AuthNavigator';
import authStorage from './app/auth/storage';

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  }

  if (!isReady)
    return <AppLoading startAsync={restoreUser} onFinish={() => setIsReady(true)} />

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {user ? (user.role === "athlete" ? <AthleteDashboard/> : (user.role === "therapist" ? <TherapistDashboard/> : (user.role === "admin" ? <AdminDashboard/> : <NavigationContainer><AuthNavigator/></NavigationContainer>))) : <NavigationContainer><AuthNavigator/></NavigationContainer>}
    </AuthContext.Provider>
  );
}