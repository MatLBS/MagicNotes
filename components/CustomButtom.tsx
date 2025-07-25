import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { validateLogin } from '@/services/login';
import { validateRegistration } from '@/services/register';

import { router } from "expo-router";

type CustomButtonPropsRegister = {
  label: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  setError: (value: string) => void;
};

type CustomButtonPropsLogin = {
  label: string;
  email: string;
  password: string;
  setError: (value: string) => void;
};

export function CustomButtonRegister({label, fullName, email, password, confirmPassword, setError}: CustomButtonPropsRegister) {
  return (
    <TouchableOpacity
      onPress={async () => {
        const result = await validateRegistration({ fullName, email, password, confirmPassword, setError });
		if (result)
			router.push("./(tabs)/profile");
      }}
      style={{
        backgroundColor: '#AD40AF',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: '#fff',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function CustomButtonLogin({label, email, password, setError}: CustomButtonPropsLogin) {
  return (
    <TouchableOpacity
      onPress={async () => {
        const result = await validateLogin({email, password, setError });
		if (result)
			router.push("./(tabs)/profile");
      }}
      style={{
        backgroundColor: '#AD40AF',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: '#fff',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}