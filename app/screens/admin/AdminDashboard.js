import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AdminNavigator from '../../navigation/AdminNavigator';
import AdminHeader from '../../components/shared/GeneralHeader';
import { StatusBar } from 'react-native';
function AdminDashboard(props) {
    return (<>
      <AdminHeader/>
      <NavigationContainer>
          <AdminNavigator/>
      </NavigationContainer>
      <StatusBar/>
  </>
  );
}


export default AdminDashboard;
