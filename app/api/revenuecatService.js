// revenuecatService.js
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";
import { REVENUECAT_IOS_KEY } from "@env";

// const apiKeys = {
//   ios: 'your_revenuecat_ios_key',
//   android: 'your_revenuecat_android_key',
// };

const PRO_ENTITLEMENT = "Pro access";

export const InitRevenueCat = async () => {
  try{
    console.log("Initializing RevenueCat...");
    if (Platform.OS === "ios") {
      console.log("configuring purchases for ios");
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
    console.log("Logging in user with RevenueCat ID:", rcCustomerId);
    await Purchases.logIn(rcCustomerId);
    console.log("User logged in successfully (RevenueCat)");
  } catch (e) {
    console.error("Error logging in user (RevenueCat)", e);
  }
};

export const handleLogout = async () => {
  try {
    console.log("Logging out user...");
    await Purchases.logOut();
    console.log("User logged out successfully (RevenueCat)");
  } catch (e) {
    console.error("Error logging out user (RevenueCat)", e);
  }
}

export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (e) {
    console.error("Error fetching offerings", e);
    return null;
  }
};

export const PurchasePackage = async (pkg) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { success: true, customerInfo };
  } catch (e) {
    console.error("Purchase error", e);
    return { success: false, error: e };
  }
};

export const checkProEntitlement = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();

    if (
      customerInfo.entitlements.active[PRO_ENTITLEMENT]
    ) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error("Failed to fetch entitlements", e);
    return false;
  }
};