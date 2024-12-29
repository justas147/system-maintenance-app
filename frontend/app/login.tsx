import { useBoundStore } from '@/state';
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Pressable } from "react-native";
import { router } from 'expo-router';
import { handleError } from '@/utils/error';
import CustomBanner from '@/components/CustomBanner';
import { useTheme } from 'react-native-paper';

export default function Login() {
  const theme = useTheme();

  const [email, setEmail] = useState(
    process.env.NODE_ENV === "development" ? 
      (process.env.EXPO_PUBLIC_DEV_USERNAME ?? "") : 
      ""
  );
  const [password, setPassword] = useState(
    process.env.NODE_ENV === "development" ? 
      (process.env.EXPO_PUBLIC_DEV_PASSWORD ?? "") : 
      ""
  );
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await useBoundStore.getState().login(email, password);

      if (response.error) {
        handleError(response.message);
      }

      router.replace("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      handleError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize='none'
        />

        <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.text}>Login</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.push("/register")}>
          <Text style={styles.text}>Register</Text>
        </Pressable>
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
    margin: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
});