export default {
  expo: {
    name: "SportStretch",
    slug: "sportstretch",
    version: "1.0.4",
    orientation: "portrait",
    icon: "./app/assets/icon.png",
    splash: {
      image: "./app/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      buildNumber: "62",
      bundleIdentifier: "com.sportstretchusa.sportstretch",
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app uses the location to provide the client with a list of nearby service providers.",
        NSCameraUsageDescription: "This app uses the camera to let therapists upload profile photos.",
        NSPhotoLibraryUsageDescription: "This app uses the photo library to let therapists upload profile photos.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./app/assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      versionCode: 3,
      package: "com.sportstretchusa.sportstretch",
      permissions: [],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },

    plugins: ["expo-secure-store"],

    // plugins: [
    //   [
    //     "react-native-purchases",
    //     {
    //       // This is the API key you get from RevenueCat
    //       apiKey: "appl_JleRblwotkDjKkwYKZozPqcIfkT",
    //     },
    //   ],
    // ],
    web: {
      favicon: "./app/assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "c5a66d1e-1ef2-4a47-8543-97fe5e83cdb2",
      },
    },
    owner: "kevohunch0",
  },
};
