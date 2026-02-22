// revenuecatService.js
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";
import { REVENUECAT_IOS_KEY, REVENUECAT_GOOGLE_KEY } from "@env";

// const apiKeys = {git s
//   ios: 'your_revenuecat_ios_key',
//   android: 'your_revenuecat_android_key',
// };

const PRO_ENTITLEMENT = "Pro access";
const BASIC_ENTITLEMENT = "Basic access";

let isRevenueCatInitialized = false;

export const InitRevenueCat = async (rcCustomerId = null) => {
  try {
    console.log("Initializing RevenueCat...");
    console.log(`configuring purchases for platform: ${Platform.OS}`);
    
    console.warn("RevenueCat API Keys - iOS:", REVENUECAT_IOS_KEY, "Android:", REVENUECAT_GOOGLE_KEY);
    console.warn("process.env.REVENUECAT_GOOGLE_KEY:", process.env.REVENUECAT_GOOGLE_KEY);
    
    const apiKey = Platform.OS === "ios" ? REVENUECAT_IOS_KEY : REVENUECAT_GOOGLE_KEY;
    
    Purchases.configure({
      apiKey: apiKey,
      appUserID: rcCustomerId || null,
    });

    // Mark as initialized immediately after configure
    isRevenueCatInitialized = true;
    console.log("RevenueCat configured, fetching offerings...");
    
    // Add timeout wrapper for getOfferings to prevent hanging in production
    const offeringsPromise = getOfferings();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('RevenueCat getOfferings timeout after 15s')), 15000)
    );
    
    try {
      await Promise.race([offeringsPromise, timeoutPromise]);
    } catch (timeoutError) {
      console.warn("RevenueCat getOfferings timed out, continuing anyway:", timeoutError.message);
      // Don't throw - continue with initialization
    }
    
    console.log("RevenueCat initialization completed successfully");
  } catch (e) {
    console.error("Failed to initialize RevenueCat", e);
    // Mark as initialized even on error to prevent hanging
    isRevenueCatInitialized = true;
    throw e; // Re-throw to let App.js handle it
  }
};

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
    console.warn("Error logging out user (RevenueCat)", e);
  }
};

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
    // if (!isRevenueCatInitialized) {
    //   console.warn("RevenueCat not initialized yet, returning false");
    //   return false;
    // }
    
    const customerInfo = await Purchases.getCustomerInfo();
    
    if (customerInfo.entitlements.active[PRO_ENTITLEMENT]) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error("Failed to fetch entitlements", e);
    return false;
  }
};

export const checkProOrBasicEntitlement = async () => {
  try {
    if (!isRevenueCatInitialized) {
      console.warn("RevenueCat not initialized yet, returning false");
      return false;
    }
    
    const customerInfo = await Purchases.getCustomerInfo();
    console.log("Customer Info:", customerInfo);
    if (
      customerInfo.entitlements.active[PRO_ENTITLEMENT] ||
      customerInfo.entitlements.active[BASIC_ENTITLEMENT]
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
