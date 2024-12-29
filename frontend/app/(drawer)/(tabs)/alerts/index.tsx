import { AlertList } from '@/components/alerts/AlertList';
import { useBoundStore } from '@/state';
import { handleError } from '@/utils/error';
import { useEffect } from 'react';
import { View } from 'react-native';

const MyComponent = () => {
  const fetchAlerts = useBoundStore((state) => state.fetchAlerts);
  const user = useBoundStore(state => state.user);
  const selectedTeam = useBoundStore(state => state.selectedTeam);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !selectedTeam?.id) {
        handleError("User or team not found");
        return;
      }

      await fetchAlerts(selectedTeam.id, user.id);
    }

    fetchData();

    // alert pooling
    const interval = setInterval(() => {
      console.log('Polling for alerts');
      fetchData();
    }, 20000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <AlertList />
    </View>
  );
};

export default MyComponent;