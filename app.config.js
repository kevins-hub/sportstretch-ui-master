// const withReactNativePurchases = require("./plugins/withReactNativePurchases");
// const { withPlugins } = require("@expo/config-plugins");

// const config = {
//   expo: {
//     name: "SportStretch",
//     slug: "sportstretch",
//     projectId: "c5a66d1e-1ef2-4a47-8543-97fe5e83cdb2",
//     version: "1.0.0",
//     orientation: "portrait",
//     icon: "./app/assets/icon.png",
//     splash: {
//       image: "./app/assets/splash.png",
//       resizeMode: "contain",
//       backgroundColor: "#ffffff",
//     },
//     updates: {
//       fallbackToCacheTimeout: 0,
//     },
//     assetBundlePatterns: ["**/*"],
//     ios: {
//       buildNumber: "6",
//       bundleIdentifier: "com.sportstretchusa.sportstretch",
//       supportsTablet: true,
//       infoPlist: {
//         NSLocationWhenInUseUsageDescription:
//           "This app uses the location to provide the client with a list of nearby service providers.",
//       },
//     },
//     android: {
//       adaptiveIcon: {
//         foregroundImage: "./app/assets/adaptive-icon.png",
//         backgroundColor: "#FFFFFF",
//       },
//       package: "com.sportstretchusa.sportstretch",
//     },
//     plugins: [
//       [
//         "react-native-purchases",
//         {
//           // This is the API key you get from RevenueCat
//           apiKey: "appl_JleRblwotkDjKkwYKZozPqcIfkT",
//         },
//       ],
//     ],
//     web: {
//       favicon: "./app/assets/favicon.png",
//     },
//     extra: {
//       eas: {
//         projectId: "c5a66d1e-1ef2-4a47-8543-97fe5e83cdb2",
//       },
//     },
//     owner: "kevohunch0",
//   },
// };


export default {
  expo: {
    name: "SportStretch",
    slug: "sportstretch",
    version: "1.0.0",
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
      buildNumber: "10",
      bundleIdentifier: "com.sportstretchusa.sportstretch",
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app uses the location to provide the client with a list of nearby service providers.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./app/assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.sportstretchusa.sportstretch",
    },
    
      plugins: [
        "expo-secure-store"
      ],
    
    
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
}

// export default ({ config }) => {
//   return withPlugins(
//     {
//       ...config,
//       expo: {
//         name: "SportStretch",
//         slug: "sportstretch",
//         projectId: "c5a66d1e-1ef2-4a47-8543-97fe5e83cdb2",
//         version: "1.0.0",
//         orientation: "portrait",
//         icon: "./app/assets/icon.png",
//         splash: {
//           image: "./app/assets/splash.png",
//           resizeMode: "contain",
//           backgroundColor: "#ffffff",
//         },
//         updates: {
//           fallbackToCacheTimeout: 0,
//         },
//         assetBundlePatterns: ["**/*"],
//         ios: {
//           buildNumber: "6",
//           bundleIdentifier: "com.sportstretchusa.sportstretch",
//           supportsTablet: true,
//           infoPlist: {
//             NSLocationWhenInUseUsageDescription:
//               "This app uses the location to provide the client with a list of nearby service providers.",
//           },
//         },
//         android: {
//           adaptiveIcon: {
//             foregroundImage: "./app/assets/adaptive-icon.png",
//             backgroundColor: "#FFFFFF",
//           },
//           package: "com.sportstretchusa.sportstretch",
//         },
//         plugins: [
//           [
//             "react-native-purchases",
//             {
//               // This is the API key you get from RevenueCat
//               apiKey: "appl_JleRblwotkDjKkwYKZozPqcIfkT",
//             },
//           ],
//         ],
//         web: {
//           favicon: "./app/assets/favicon.png",
//         },
//         extra: {
//           eas: {
//             projectId: "c5a66d1e-1ef2-4a47-8543-97fe5e83cdb2",
//           },
//         },
//         owner: "kevohunch0",
//       },
//     },
//     [withReactNativePurchases]
//   );
// };

// {
//   "expo": {
//     "name": "SportStretch",
//     "slug": "sportstretch",
//     "version": "1.0.0",
//     "orientation": "portrait",
//     "icon": "./app/assets/icon.png",
//     "splash": {
//       "image": "./app/assets/splash.png",
//       "resizeMode": "contain",
//       "backgroundColor": "#ffffff"
//     },
//     "updates": {
//       "fallbackToCacheTimeout": 0
//     },
//     "assetBundlePatterns": [
//       "**/*"
//     ],
//     "ios": {
//       "buildNumber": "5",
//       "bundleIdentifier": "com.sportstretchusa.sportstretch",
//       "supportsTablet": true,
//       "infoPlist": {
//         "NSLocationWhenInUseUsageDescription": "This app uses the location to provide the client with a list of nearby service providers."
//       }
//     },
//     "android": {
//       "adaptiveIcon": {
//         "foregroundImage": "./app/assets/adaptive-icon.png",
//         "backgroundColor": "#FFFFFF"
//       }
//     },
//     "web": {
//       "favicon": "./app/assets/favicon.png"
//     },
//     "extra": {
//       "eas": {
//         "projectId": "c5a66d1e-1ef2-4a47-8543-97fe5e83cdb2"
//       }
//     },
//     "owner": "kevohunch0"
//   }
// }
