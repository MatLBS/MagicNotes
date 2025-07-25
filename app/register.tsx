import React, {useState} from 'react'; 
 import { router } from "expo-router";
import { icons } from "@/constants/icons";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import InputField from '../components/InputField';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RegistrationSVG from '@/assets/images/registration.svg';
import GoogleSVG from '@/assets/images/google.svg';
import FacebookSVG from '@/assets/images/facebook.svg';
import {CustomButtonRegister} from '@/components/CustomButtom';

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>
          <RegistrationSVG
            height={300}
            width={300}
            style={{transform: [{rotate: '-5deg'}]}}
          />
        </View>

        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Register
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <GoogleSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <FacebookSVG height={24} width={24} />
          </TouchableOpacity>
        </View>

        <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
          Or, register with email ...
        </Text>
		<View>
		{error ? (
			<Text style={{ color: 'red', marginVertical: 8 }}>
			{error}
			</Text>
		) : null}
    </View>
        <InputField
          label={'Full Name'}
		  placeholder="Tom Holland"
          value={fullName}
          onChangeText={setFullName}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
        />

        <InputField
          placeholder='yours@email.com'
          label={'Email ID'}
          value={email}
          onChangeText={setEmail}
          icon={
			<Image
				source={icons.email}
				className="w-5 h-5"
				style={{marginRight: 5}}
			/>
          }
          keyboardType="email-address"
        />

        <InputField
          label={'Password'}
          placeholder='enter password'
          value={password}
          onChangeText={setPassword}
          icon={
            <Image
				source={icons.password}
				className="w-5 h-5"
				style={{marginRight: 5}}
			/>
          }
          inputType="password"
        />

        <InputField
          label={'Confirm Password'}
          placeholder='repeat password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          icon={
            <Image
              source={icons.password}
              className="w-5 h-5"
              style={{marginRight: 5}}
            />
          }
          inputType="password"
        />

        <CustomButtonRegister 
			label={'Register'} 
			fullName={fullName} 
			email={email} 
			password={password} 
			confirmPassword={confirmPassword}
			setError={setError}
		/>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>Already registered?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;