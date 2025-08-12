import { icons } from "@/constants/icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { googleConnection, facebookConnection } from "@/services/appwrite"

import FacebookSVG from "@/assets/images/facebook.svg";
import GoogleSVG from "@/assets/images/google.svg";
import LoginSVG from "@/assets/images/login.svg";

import { CustomButtonLogin } from "@/components/CustomButtom";
import InputField from "../components/InputField";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: "197139425413-sk3qv01sgjq5aj8sfuu8qeeacoskldmb.apps.googleusercontent.com",
      webClientId: "197139425413-o3eh4ntpf1ade0gt1brf2lmv0ekbukcd.apps.googleusercontent.com",
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: "center" }}>
          <LoginSVG
            height={300}
            width={300}
            style={{ transform: [{ rotate: "-5deg" }] }}
          />
        </View>

        <Text
          style={{
            fontFamily: "Roboto-Medium",
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          Login
        </Text>
        {error ? (
          <Text style={{ color: "red", marginVertical: 8 }}>{error}</Text>
        ) : null}
        <InputField
          placeholder="yours@email.com"
          label={"Email ID"}
          value={email}
          onChangeText={setEmail}
          icon={
            <Image
              source={icons.email}
              className="w-5 h-5"
              style={{ marginRight: 5 }}
            />
          }
          keyboardType="email-address"
        />

        <InputField
          label={"Password"}
          placeholder="enter password"
          value={password}
          onChangeText={setPassword}
          icon={
            <Image
              source={icons.password}
              className="w-5 h-5"
              style={{ marginRight: 5 }}
            />
          }
          inputType="password"
        />

        <CustomButtonLogin
          label={"Login"}
          email={email}
          password={password}
          setError={setError}
        />

        <Text style={{ textAlign: "center", color: "#666", marginBottom: 30 }}>
          Or, login with ...
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => googleConnection()}
            style={{
              borderColor: "#ddd",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <GoogleSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => facebookConnection()}
            style={{
              borderColor: "#ddd",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <FacebookSVG height={24} width={24} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => router.navigate("./register")}>
            <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
              {" "}
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
