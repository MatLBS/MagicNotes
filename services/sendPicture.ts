import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

const URL_BACKEND_UPLOAD = process.env.EXPO_PUBLIC_URL_BACKEND_UPLOAD!;

export const sendImageToServer = async (
  uri: string
): Promise<string | null> => {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  if (!fileInfo.exists) {
    console.error("Fichier introuvable à l'URI donnée");
    return null;
  }

  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }],
    { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG }
  );

  const formData = new FormData();
  formData.append("file", {
    uri: manipResult.uri,
    type: "image/jpeg",
    name: "photo.jpg",
  } as any);

  try {
    console.log("---------------------------------");
    // const response = await fetch("http://192.168.1.14:8000/uploadImage", {
	const response = await fetch(URL_BACKEND_UPLOAD, {
      method: "POST",
      body: formData,
    });
    const text = await response.text();
    // console.log("Réponse brute :", text);
    if (!response.ok) {
    	throw new Error(`Erreur HTTP : ${response.status}`);
    } else
		return text;
  } catch (error) {
    console.error("Erreur lors de l'envoi :", error);
    return null;
  }
};
