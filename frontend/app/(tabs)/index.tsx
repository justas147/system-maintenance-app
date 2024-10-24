import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
      <ThemedText 
        type="title" 
        style={styles.titleContainer}
      >
        Welcome!
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
