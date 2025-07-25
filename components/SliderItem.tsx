import { icons } from "@/constants/icons";
import { Fontisto } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { deleteNote } from "@/services/appwrite";

type NotesSliderType = {
  $id: string;
  users: string;
  name: string;
  notes: string;
  Created: Date;
  Updated: Date;
};

type Props = {
  item: NotesSliderType;
  index: number;
  fetchUserNotes?: () => void;
};

const { width } = Dimensions.get("screen");

const SliderItem = ({ item, index, fetchUserNotes }: Props) => {
  return (
    <View style={styles.itemContainer}>
      {/* <View className="flex-row align-center gap-10 mb-4 border-2 border-indigo-500"> */}
      <Text style={styles.titleText}>{item.name}</Text>

      {/* </View> */}
      <ScrollView
        style={styles.notesScrollContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <Text style={styles.notesText}>{item.notes}</Text>
      </ScrollView>
      <View className="flex-row justify-around items-center w-full">
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/(tabs)",
              params: {
                noteText: item.notes,
                noteName: item.name,
                noteId: item.$id,
              },
            });
          }}
        >
          <Image
            source={icons.edit}
            className="w-6 h-6 mt-3"
            style={{ marginRight: 5 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            try {
              await deleteNote(item.$id);
              fetchUserNotes?.();
            } catch (error) {
              console.error("Erreur lors de la suppression:", error);
            }
          }}
        >
          <Fontisto name="trash" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SliderItem;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#1e1e1e",
    justifyContent: "flex-start",
    alignItems: "center",
    width: width * 0.8,
    height: 400,
    padding: 16,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  titleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  notesScrollContainer: {
    flex: 1,
    width: "100%",
    maxHeight: 220,
  },
  notesText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
