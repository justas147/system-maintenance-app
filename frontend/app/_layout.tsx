import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MD2LightTheme, MD3DarkTheme, PaperProvider, adaptNavigationTheme } from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

const darkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const lightTheme = { ...MD2LightTheme, colors: Colors.light };

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const colorScheme = 'light';

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });
  

  const paperTheme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={paperTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={
            { headerShown: false }
          } />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
      <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
    </PaperProvider>
  );
}
