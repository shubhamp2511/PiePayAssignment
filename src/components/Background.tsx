// @ts-nocheck
import React from 'react';
import { View, KeyboardAvoidingView, StyleSheet } from 'react-native';

/**
 * Simple background wrapper that matches the white background used in the original Explore screen.
 * It is a very thin abstraction so we can swap styles later if we need to.
 */
const Background = ({ children }) => {
  return (
    <View style={styles.background}>
      <KeyboardAvoidingView style={styles.container}>
        {children}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Background;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
});
