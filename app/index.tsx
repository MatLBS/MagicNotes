import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo/Titre principal */}
        <View className="items-center mb-16">
          <Text className="text-white text-5xl font-bold mb-4">MagicNotes</Text>
          <Text className="text-gray-400 text-xl text-center leading-relaxed">
            Transformez vos photos en notes{"\n"}
            avec l&apos;intelligence artificielle
          </Text>
        </View>

        {/* Boutons d'action */}
        <View className="w-full">
          <TouchableOpacity
            className="bg-blue-600 p-4 rounded-xl"
            onPress={() => router.push("./login")}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Se connecter
            </Text>
          </TouchableOpacity>
        </View>

        {/* Texte informatif */}
        <View className="mt-12 px-4">
          <Text className="text-gray-500 text-center text-sm leading-relaxed">
            Connectez-vous pour commencer à utiliser vos notes
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
