import { Slot } from "expo-router";
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Api } from "@/constants/Api";

export default function RootLayout() {
  // TODO: Add dark mode support
  // let colorScheme = useColorScheme();
  let colorScheme = "light";
  console.log("colorScheme", colorScheme);
  const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}> 
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
