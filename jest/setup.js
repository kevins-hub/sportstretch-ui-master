import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock SecureStore  
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

// Mock Expo Constants
jest.mock('expo-constants', () => ({
  default: {
    statusBarHeight: 44,
    deviceName: 'iPhone',
    manifest: {},
  },
}));

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name, ...props }) => 
      <Text {...props} testID={`material-community-icon-${name}`}>{name}</Text>,
    FontAwesome: ({ name, ...props }) => 
      <Text {...props} testID={`font-awesome-icon-${name}`}>{name}</Text>,
    MaterialIcons: ({ name, ...props }) => 
      <Text {...props} testID={`material-icon-${name}`}>{name}</Text>,
    AntDesign: ({ name, ...props }) => 
      <Text {...props} testID={`ant-design-icon-${name}`}>{name}</Text>,
    Entypo: ({ name, ...props }) => 
      <Text {...props} testID={`entypo-icon-${name}`}>{name}</Text>,
    EvilIcons: ({ name, ...props }) => 
      <Text {...props} testID={`evil-icon-${name}`}>{name}</Text>,
    Feather: ({ name, ...props }) => 
      <Text {...props} testID={`feather-icon-${name}`}>{name}</Text>,
    Foundation: ({ name, ...props }) => 
      <Text {...props} testID={`foundation-icon-${name}`}>{name}</Text>,
    Ionicons: ({ name, ...props }) => 
      <Text {...props} testID={`ionicon-${name}`}>{name}</Text>,
    Octicons: ({ name, ...props }) => 
      <Text {...props} testID={`octicon-${name}`}>{name}</Text>,
    SimpleLineIcons: ({ name, ...props }) => 
      <Text {...props} testID={`simple-line-icon-${name}`}>{name}</Text>,
    Zocial: ({ name, ...props }) => 
      <Text {...props} testID={`zocial-icon-${name}`}>{name}</Text>,
  };
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return ({ name, ...props }) => 
    <Text {...props} testID={`material-community-icon-${name}`}>{name}</Text>;
});

// Mock react-native-stars
jest.mock('react-native-stars', () => {
  const { View } = require('react-native');
  return ({ rating, ...props }) => <View {...props} testID={`stars-${rating}`} />;
});

// Mock LottieView
jest.mock('lottie-react-native', () => {
  const { View } = require('react-native');
  return ({ source, ...props }) => <View {...props} testID="lottie-view" />;
});

// Mock RevenueCat
jest.mock('react-native-purchases', () => ({
  configure: jest.fn(),
  setDebugLogsEnabled: jest.fn(),
  getCustomerInfo: jest.fn(),
  getOfferings: jest.fn(),
  purchasePackage: jest.fn(),
  restorePurchases: jest.fn(),
}));

// Mock Expo JWT
jest.mock('expo-jwt', () => ({
  decode: jest.fn((token) => {
    if (token === 'mock-jwt-token') {
      return {
        exp: Math.floor(Date.now() / 1000) + 3600,
        user: { id: '123', email: 'test@example.com', role: 'athlete' },
      };
    }
    return null;
  }),
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    setParams: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }),
  useRoute: () => ({ key: 'test', name: 'Test', params: {} }),
  useFocusEffect: jest.fn(),
  NavigationContainer: ({ children }) => children,
}));

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  const TextInput = require('react-native').TextInput;
  return {
    gestureHandlerRootHOC: jest.fn((Component) => Component),
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: TextInput,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    Directions: {},
  };
});

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// ...existing code...

// Global test timeout
jest.setTimeout(10000);
