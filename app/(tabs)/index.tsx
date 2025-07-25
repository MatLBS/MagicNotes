import BottomSheet, { BottomSheetRefProps } from "@/components/BottomSheet";
import PhotoPreviewSection from "@/components/PhotoPreviewSections";
import { icons } from "@/constants/icons";
import { generateSummary } from "@/services/generateSummary"
import { createNote } from "@/services/appwrite";
import { sendImageToServer } from "@/services/sendPicture";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const ref = useRef<BottomSheetRefProps>(null);
  const [noteText, setNoteText] = useState<string>("");
  const [noteName, setNoteName] = useState<string>("");
  const [noteId, setNoteId] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  // Récupération des paramètres de navigation
  const params = useLocalSearchParams();

  const onPress = useCallback(() => {
    ref?.current?.scrollTo(-200);
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await SecureStore.getItemAsync("userId");
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Effet pour récupérer les données de la note quand on navigue depuis SliderItem
  useFocusEffect(
    useCallback(() => {
      if (params.noteText) {
        setNoteText(params.noteText as string);
        setNoteName(params.noteName as string);
        setNoteId(params.noteId as string);
        // Ouvrir automatiquement la BottomSheet avec le texte
        setTimeout(() => {
          ref?.current?.scrollTo(-200);
        }, 100);
      }
    }, [params.noteText, params.noteName, params.noteId])
  );

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takedPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  if (photo)
    return (
      <PhotoPreviewSection
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
        sendImageToServer={(photo) => sendImageToServer(photo.uri)}
        setNoteText={setNoteText}
      />
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        </CameraView>
		<View className="absolute top-16 left-5">
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Image source={icons.flip} className="w-8 h-8" tintColor="#fff" />
            </TouchableOpacity>
        </View>
		<View className="absolute bottom-32 left-0 right-0 flex items-center">
            <TouchableOpacity
              style={styles.takePhotoBtn}
              onPress={handleTakePhoto}
            />
        </View>
          <View className="absolute top-16 right-5">
            <TouchableOpacity onPress={onPress}>
              <Image source={icons.list} className="w-9 h-9" tintColor="#fff" />
            </TouchableOpacity>
        </View>
        <BottomSheet ref={ref}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
				<View style={{ alignItems: "center", marginTop: 20 }}>
					<TextInput
					style={{
						width: "60%",
						height: 40,
						paddingHorizontal: 12,
						borderRadius: 8,
						borderWidth: 1,
						borderColor: "#bbb",
						fontSize: 18,
						backgroundColor: "#f5f5f5",
						textAlign: "center",
					}}
					onChangeText={setNoteName}
					placeholder="Nom de la note"
					placeholderTextColor="#888"
					value={noteName}
					/>
				</View>
              {/* <Text
                style={{
                  color: "#000",
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 18,
                }}
              >
                Vos notes :
              </Text> */}
              <ScrollView
                style={{ flex: 1, margin: 20 }}
                keyboardShouldPersistTaps="handled"
              >
                <TextInput
                  style={styles.input}
                  onChangeText={setNoteText}
                  value={noteText}
                  multiline={true}
                  textAlignVertical="top"
				  placeholder="Vos notes..."
				  placeholderTextColor="#888"
                />
				<TouchableOpacity
                  style={styles.sendButton}
                  onPress={async () => {
					if (!noteText.trim())
						return alert("Veuillez entrer du texte avant de générer un résumé.");
                    const summary = await generateSummary(noteText);
                    setNoteText(summary!);
                  }}
                >
					<View className="flex flex-row items-center gap-4">
						<Text className="text-white text-lg">
              				Générer un résumé avec l&apos;IA
						</Text>
						<Image
							source={icons.stars}
							className="w-8 h-8"
							tintColor="#fff"
						/>
					</View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => {
                    createNote(noteText, noteName, noteId, userId);
                    setNoteText("");
					setNoteName("");
					setNoteId("");
                  }}
                >
                  <Image
                    source={icons.send}
                    className="w-8 h-8"
                    tintColor="#fff"
                  />
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "white",
    opacity: 0.6,
  },
  takePhotoBtn: {
    position: "absolute",
    bottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    alignSelf: "center",
    borderStyle: "solid",
    borderWidth: 5,
    borderColor: "purple",
  },
  input: {
    minHeight: 200,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
});
