// revenuecatService.js
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";
import { REVENUECAT_IOS_KEY } from "@env";

// const apiKeys = {
//   ios: 'your_revenuecat_ios_key',
//   android: 'your_revenuecat_android_key',
// };

export const InitRevenueCat = () => {
  console.warn("Initializing RevenueCat...");
  if (Platform.OS === "ios") {
    console.warn("configuring purchases for ios");
    Purchases.configure({
      apiKey: 'appl_JleRblwotkDjKkwYKZozPqcIfkT',
    });
  }
  getOfferings();
};


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
    const isPro = customerInfo.entitlements.active.pro !== undefined;
    return { success: isPro, customerInfo };
  } catch (e) {
    console.warn("Purchase error", e);
    return { success: false, error: e };
  }
};
