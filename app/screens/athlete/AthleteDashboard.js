import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AthleteNavigator from "../../navigation/AthleteNavigator";
import AthleteHeader from "../../components/shared/GeneralHeader";
import ChangePasswordButton from "../../components/shared/ChangePasswordButton";
import AuthNavigator from "../../navigation/AuthNavigator";

function AthleteDashboard(props) {
  return (
    <>
      <AthleteHeader />
      <NavigationContainer>
        <AthleteNavigator />
      </NavigationContainer>
    </>
  );
}

export default AthleteDashboard;
