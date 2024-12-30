import { useBoundStore } from '@/state';
import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { router } from 'expo-router';
import { handleError } from '@/utils/error';
import CustomBanner from '@/components/CustomBanner';
import { useTheme } from 'react-native-paper';
import CustomButton from '@/components/common/CustomButton';
import { validateEmail } from '@/utils/validation';

export default function Login() {
  const login = useBoundStore(state => state.login);
  const theme = useTheme();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (validateEmail(text)) {
      setEmailError('');
    } else {
      setEmailError('Please enter a valid email address.');
    }
  };

  const [email, setEmail] = useState(
    process.env.NODE_ENV === "development" ? 
      (process.env.EXPO_PUBLIC_DEV_USERNAME ?? "") : 
      ""
  );
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState(
    process.env.NODE_ENV === "development" ? 
      (process.env.EXPO_PUBLIC_DEV_PASSWORD ?? "") : 
      ""
  );
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login(email, password);
      router.replace("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "unknown error";
      handleError("An error occurred while logging in: " + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <CustomBanner />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          autoCapitalize='none'
          onChangeText={handleEmailChange}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize='none'
        />

        <CustomButton onPress={handleLogin} disabled={loading} title="Login" />
        <CustomButton onPress={() => router.push("/register")} title="Register" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 48,
  },
  button: {
    marginTop: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});