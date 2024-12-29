import { useBoundStore } from '@/state';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import TeamSelect from '@/components/teams/TeamSelect';

const AlertsPage = () => {
  const user = useBoundStore((state) => state.user);

  const handleLogout = () => {
    useBoundStore.getState().logout();
    router.replace("/login");
  };

  return (
    <View>      
      <TeamSelect />

      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 20 }}>
        <Text>Logged as {user?.name}</Text>
      </View>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.text}>Logout</Text>
      </Pressable>
    </View>
  );
};

// TODO: figure out global styles
const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    marginHorizontal: 16,
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
});

export default AlertsPage;