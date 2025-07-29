// @ts-nocheck
import React from 'react';
import { View, TextInput, Pressable, StyleSheet, Text } from 'react-native';

/**
 * Simple reusable search bar.  It does **not** depend on any TypeScript types or external images.
 */
const SearchBar = ({ value, onChangeText, placeholder, onSubmit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9E9E9E"
          style={styles.textInput}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoFocus={false}
          onSubmitEditing={onSubmit}
        />
        <Pressable style={styles.iconContainer} onPress={onSubmit}>
          <Text style={{ fontSize: 18, color: '#424242' }}>🔍</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
  },
  searchContainer: {
    backgroundColor: '#F1F1F1',
    height: 50,
    flexDirection: 'row',
    borderRadius: 14,
    paddingLeft: 14,
    alignItems: 'center',
    width: '90%',
  },
  textInput: {
    flex: 1,
    color: '#212121',
    fontSize: 16,
  },
  iconContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
