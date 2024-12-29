import React, { useEffect } from 'react';
import {  
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated 
} from 'react-native';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  style?: object;
}

export default function ErrorMessage({ message, onRetry, style }: ErrorMessageProps) {
  const opacity = new Animated.Value(0);
  
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }, style]}>
      
      <Text style={styles.message}>
        {message}
      </Text>
      
      {onRetry && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FCA5A5',
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#991B1B',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});