import { Fontisto } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const callFunctions = async (
  sendImageToServer: (photo: any) => Promise<string | null>,
  handleRetakePhoto: () => void,
  photo: any,
  setNoteText: React.Dispatch<React.SetStateAction<string>>
) => {
  handleRetakePhoto();
  const response = await sendImageToServer(photo);
  // Agrège les valeurs au lieu de les remplacer
  setNoteText((prevText) =>
    prevText ? `${prevText}\n\n${response || ""}` : response || ""
  );
};

const PhotoPreviewSection = ({
  photo,
  handleRetakePhoto,
  sendImageToServer,
  setNoteText,
}: {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
  sendImageToServer: (photo: CameraCapturedPicture) => Promise<string | null>;
  setNoteText: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <LinearGradient colors={["#232526", "#414345"]} style={styles.gradient}>
    <SafeAreaView style={styles.container} className="relative">
      <View style={styles.boxShadow}>
        <Image
          style={styles.previewContainer}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
          resizeMode="cover"
        />
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={handleRetakePhoto}
        className="left-20 bg-[#e53935]"
      >
        <Fontisto name="trash" size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fab}
        className="right-20 bg-[#1976d2]"
        onPress={() =>
          callFunctions(
            sendImageToServer,
            handleRetakePhoto,
            photo,
            setNoteText
          )
        }
      >
        <Fontisto name="share-a" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  boxShadow: {
    width: width * 0.92,
    height: height * 0.6,
    borderRadius: 24,
    backgroundColor: "#222",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  previewContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  fab: {
    position: "absolute",
    bottom: 85,
    alignSelf: "center",
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#e53935",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default PhotoPreviewSection;
