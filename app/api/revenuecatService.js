// revenuecatService.js
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";
import { REVENUECAT_IOS_KEY } from "@env";

// const apiKeys = {
//   ios: 'your_revenuecat_ios_key',
//   android: 'your_revenuecat_android_key',
// };

export const InitRevenueCat = async () => {
  try{
    console.warn("Initializing RevenueCat...");
    if (Platform.OS === "ios") {
      console.warn("configuring purchases for ios");
      Purchases.configure({
        apiKey: 'appl_JleRblwotkDjKkwYKZozPqcIfkT',
      });
    }
    await getOfferings();
  } catch (e) {
    console.error("Failed to initialize RevenueCat", e);
  }
}

export const handleLogin = async (rcCustomerId) => {
  try {
    console.warn("Logging in user with RevenueCat ID:", rcCustomerId);
    await Purchases.logIn(rcCustomerId);
    console.warn("User logged in successfully (RevenueCat)");
  } catch (e) {
    console.warn("Error logging in user (RevenueCat)", e);
  }
};

export const handleLogout = async () => {
  try {
    console.warn("Logging out user...");
    await Purchases.logOut();
    console.warn("User logged out successfully (RevenueCat)");
  } catch (e) {
    console.warn("Error logging out user (RevenueCat)", e);
  }
}

export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (e) {
    console.warn("Error fetching offerings", e);
    return null;
  }
};

export const PurchasePackage = async (pkg) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { success: true, customerInfo };
  } catch (e) {
    console.warn("Purchase error", e);
    return { success: false, error: e };
  }
};
