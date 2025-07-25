import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface InputFieldProps {
  label: string;
  icon?: React.ReactNode;
  inputType?: "text" | "password" | "email";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  fieldButtonLabel?: string;
  fieldButtonFunction?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}

export default function InputField({
  label,
  icon,
  inputType = "text",
  keyboardType = "default",
  fieldButtonLabel,
  fieldButtonFunction,
  value,
  onChangeText,
  placeholder,
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
        alignItems: "center",
      }}
    >
      {icon && <View style={{ marginRight: 8 }}>{icon}</View>}

      <TextInput
        placeholder={placeholder || label}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        style={{
          flex: 1,
          paddingVertical: 8,
          fontSize: 16,
          color: "#333",
        }}
        secureTextEntry={inputType === "password" && !isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={inputType === "email" ? "none" : "sentences"}
        autoCorrect={false}
      />

      {inputType === "password" && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={{ marginLeft: 8 }}
        >
          <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
            {isPasswordVisible ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      )}

      {fieldButtonLabel && fieldButtonFunction && inputType !== "password" && (
        <TouchableOpacity
          onPress={fieldButtonFunction}
          style={{ marginLeft: 8 }}
        >
          <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
            {fieldButtonLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
