import * as ImagePicker from "expo-image-picker";
import { Button, Image, View, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";


function ProfilePictureUpload({ image, setImage, currentProfilePictureUrl }) {
  // const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Ask for permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Pick an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <View>
        <Text style={styles.modalText}>Choose a profile picture</Text>
      </View>
      <Button title="Select from camera roll" onPress={pickImage} />
      <View style={styles.imagePreviewContainer}>
        { image ? (
           <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        ) : currentProfilePictureUrl ? (
          <Image source={{ uri: currentProfilePictureUrl }} style={{ width: 200, height: 200 }} />
        ) : (
          <MaterialCommunityIcons
            style={styles.accountIcon}
            name="account-circle"
            size={200}
            color={colors.primary}
          />
        )}


        {/* {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
        {!image && (
          <MaterialCommunityIcons
            style={styles.accountIcon}
            name="account-circle"
            size={200}
            color={colors.primary}
          />
        )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
  imagePreviewContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
});

export default ProfilePictureUpload;
