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

import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

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
          router.push("/register");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-6 py-8">
        <View className="items-center mb-6">
          <View 
            className="bg-gray-800 rounded-full mb-4 justify-center items-center"
            style={{ 
              width: Math.min(96, height * 0.12), 
              height: Math.min(96, height * 0.12) 
            }}
          >
            <Text className="text-white text-2xl font-bold">👤</Text>
          </View>
          <Text 
            className="text-white font-semibold text-center px-4"
            style={{ fontSize: Math.min(20, height * 0.025) }}
          >
            {userInfo?.username}
          </Text>
          <Text 
            className="text-gray-400 text-center px-4"
            style={{ fontSize: Math.min(16, height * 0.02) }}
          >
            {userInfo?.email}
          </Text>
        </View>

        <View style={{ flex: 1, minHeight: height * 0.4 }}>
			<View style={{ flex: 1 }}>
				<Text 
					className="text-white font-semibold mb-4 px-2 text-center"
					style={{ fontSize: Math.min(18, height * 0.022) }}
				>
				{userNotes?.length || 0} Notes créées
				</Text>
				<View style={{ height: 360, marginBottom: 40 }}>
					<FlatList
						style={{ flex: 1 }}
						contentContainerStyle={{ 
							alignItems: 'center',
							paddingHorizontal: 10
						}}
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
		</View>
        
        <TouchableOpacity
          className="bg-red-600 rounded-xl mb-8 mx-4"
          style={{ paddingVertical: Math.max(12, height * 0.015), paddingHorizontal: 16 }}
          onPress={handleLogout}
        >
          <Text 
            className="text-white text-center font-semibold"
            style={{ fontSize: Math.min(16, height * 0.02) }}
          >
          Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
