import { icons } from "@/constants/icons";
import { Fontisto } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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

type FlipCardProps = {
  isFlipped: Animated.SharedValue<boolean>;
  direction?: 'x' | 'y';
  duration?: number;
  RegularContent: React.ReactNode;
  FlippedContent: React.ReactNode;
};

const { width } = Dimensions.get("screen");

const RegularContent = ({item}: Props) => {
  return (
	<View style={styles.itemContainer}>
		<Text style={styles.titleText}>{item.name}</Text>
		<ScrollView
			style={styles.notesScrollContainer}
			showsVerticalScrollIndicator={false}
			nestedScrollEnabled={true}
		>
			<Text style={styles.notesText}>{item.notes}</Text>
		</ScrollView>
	</View>
  );
};

const FlippedContent = ({item, fetchUserNotes}: Props) => {
	const [modalVisible, setModalVisible] = useState(false);

  return (
	<View style={styles.itemContainer}>
		<Modal
      animationType="slide"
      transparent
      visible={modalVisible}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Fontisto name="trash" size={38} color="#e53e3e" />
          </View>
          <Text style={styles.title}>Supprimer la note ?</Text>
          <Text style={styles.subtitle}>
            Êtes-vous sûr de vouloir supprimer&nbsp;
            <Text style={styles.noteName}>{item.name ?? "cette note"}</Text>&nbsp;?
            Cette action est irréversible.
          </Text>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={async () => await deleteNote(item.$id).then(() => {
				setModalVisible(false);
				fetchUserNotes?.();
			})}
            >
              <Text style={styles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
		<View className="flex-row justify-around items-center w-full h-full">
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
				className="w-10 h-10 mt-3"
				style={{ marginRight: 5 }}
			/>
			</TouchableOpacity>
			<TouchableOpacity
			onPress={() => {
				setModalVisible(true);
			}}
			>
			<Fontisto name="trash" size={38} color="white" />
			</TouchableOpacity>
      </View>
	</View>
  );
};

const FlipCard = ({
  isFlipped,
  direction = 'y',
  duration = 500,
  RegularContent,
  FlippedContent,
}: FlipCardProps) => {
  const isDirectionX = direction === 'x';

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
	const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
	const rotateValue = withTiming(`${spinValue}deg`, { duration });

	return {
	  transform: [
		isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
	  ],
	  backfaceVisibility: 'hidden'
	};
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
	const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
	const rotateValue = withTiming(`${spinValue}deg`, { duration });

	return {
	  transform: [
		isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
	  ],
	  backfaceVisibility: 'hidden'
	};
  });

  return (
	<View>
	  <Animated.View
		style={[
		  styles.regularCard,
		  regularCardAnimatedStyle,
		]}>
		{RegularContent}
	  </Animated.View>
	  <Animated.View
		style={[
		  styles.flippedCard,
		  flippedCardAnimatedStyle,
		]}>
		{FlippedContent}
	  </Animated.View>
	</View>
  );
};

const SliderItem = ({ item, index, fetchUserNotes }: Props) => {

	const isFlipped = useSharedValue(false);
	
	const handlePress = () => {
		isFlipped.value = !isFlipped.value;
	};

  return (
	<View>
		<FlipCard
			isFlipped={isFlipped}
			FlippedContent={<FlippedContent item={item} index={index} fetchUserNotes={fetchUserNotes} />}
			RegularContent={<RegularContent item={item} index={index} />}
		/>
		<View style={styles.buttonContainer}>
			<TouchableOpacity style={styles.toggleButton} onPress={handlePress}>
				<Image
					source={icons.flipNotes}
					style={{ width: 24, height: 24 }}
				/>
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
    height: 300,
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
  regularCard: {
    position: 'absolute',
    zIndex: 1,
  },
  flippedCard: {
    zIndex: 2,
  },
  buttonContainer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#b58df1',
    padding: 12,
    borderRadius: 48,
  },
  toggleButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.44)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "84%",
    backgroundColor: "#252525",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  iconContainer: {
    backgroundColor: "#fff1f0",
    borderRadius: 44,
    padding: 14,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#d1d5db",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    marginHorizontal: 10,
  },
  noteName: {
    color: "#e53e3e",
    fontWeight: "bold",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#232323",
    borderWidth: 1,
    borderColor: "#444",
  },
  deleteButton: {
    backgroundColor: "#e53e3e",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
