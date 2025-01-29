import { Alert } from "react-native";

const handleError = (response) => {
  if (!response) return;
  if (response.status === 200 || response.status === 201) {
    return false;
  }
  if (response.status > 499) {
    Alert.alert(
      "Oops! Something went wrong on our end.",
      "Please try again later."
    );
    return true;
  }
  Alert.alert(
    "Error",
    `There was an error processing your request: ${response.data}. Please try again.`,
    [
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ],
    { cancelable: false }
  );

  return true;
};

export { handleError };
