import SliderItem from "@/components/SliderItem";
import { getUserInfo, getUserNotes } from "@/services/appwrite";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("screen");

export default function ProfileScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userNotes, setUserNotes] = useState<any>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await SecureStore.getItemAsync("userId");
      const authId = await SecureStore.getItemAsync("authId");
      setUserId(id);
      if (id) {
        const user = await getUserInfo(id, authId!);
        setUserInfo(user);
      }
    };
    fetchUserId();
  }, []); // S'exécute une fois au montage

  // Fonction pour récupérer les notes utilisateur
  const fetchUserNotes = useCallback(async () => {
    if (userId) {
      const notes = await getUserNotes(userId);
      setUserNotes(notes);
    }
  }, [userId]); // S'exécute quand userId change

  // S'exécute quand la page reprend le focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchUserNotes();
      }
    }, [userId, fetchUserNotes])
  );

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("userId");
          await SecureStore.deleteItemAsync("authId");
          router.push("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-6 py-8">
        <View className="items-center mb-8 ">
          <View className="w-24 h-24 bg-gray-800 rounded-full mb-4 justify-center items-center">
            <Text className="text-white text-2xl font-bold">👤</Text>
          </View>
          <Text className="text-white text-xl font-semibold">
            {userInfo?.username}
          </Text>
          <Text className="text-gray-400 text-base">{userInfo?.email}</Text>
        </View>

        <View style={{ height: height * 0.6 }}>
			<View style={{ flex: 1 }}>
				<Text className="text-white text-lg font-semibold mb-4 px-2 text-center">
				{userNotes?.length || 0} Notes créées
				</Text>
				<View>
					<FlatList
						style={{ height: "100%" }}
						
						data={userNotes}
						renderItem={({ item, index }) => (
						<SliderItem
							item={item}
							index={index}
							fetchUserNotes={fetchUserNotes}
						/>
						)}
						horizontal
						showsHorizontalScrollIndicator={false}
						pagingEnabled
					/>
				</View>
			</View>

			<TouchableOpacity
				className="bg-red-600 rounded-xl p-4 mb-4"
				onPress={handleLogout}
			>
				<Text className="text-white text-center text-base font-semibold">
				Se déconnecter
				</Text>
			</TouchableOpacity>
		</View>
      </ScrollView>
    </SafeAreaView>
  );
}
