import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TabBarIcon } from './navigation/TabBarIcon';

const BackHeader: React.FC<{ title: string, path?: string }> = ({ title, path }) => {
  const router = useRouter();

  const handleBack = () => {
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <TabBarIcon name="chevron-back" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  backButton: {
    marginRight: 5,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
});

export default BackHeader;