import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useBoundStore } from '@/state';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import CustomButton from '@/components/common/CustomButton';
import { validateEmail } from '@/utils/validation';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useBoundStore(state => state.register);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (validateEmail(text)) {
      setEmailError('');
    } else {
      setEmailError('Please enter a valid email address.');
    }
  };

  const handleRegister = async () => {
    setLoading(true);

    let pushTokenString;
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    console.log("projectId", projectId);
    try {
      pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    console.log("pushTokenString", pushTokenString);
    } catch (e: unknown) {
      const errorMessage = `Failed to get push token for push notification! ${e}`;
      alert(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      await register(username, email, password, pushTokenString);
      router.replace("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize='none'
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize='none'
        secureTextEntry
      />

      <CustomButton 
        title="Register" 
        onPress={handleRegister} 
        disabled={loading}
      />
      <CustomButton 
        title="Back to Login" 
        onPress={() => router.replace("/login")} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  marginUp: {
    marginTop: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Register;