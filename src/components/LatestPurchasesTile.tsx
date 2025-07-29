// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import ProductTile from './ProductTile';
import WebView from 'react-native-webview';

/**
 * Horizontal list of recently bought items.
 */
const LatestPurchasesTile = ({ products = [], onRemove = () => {} }) => {
  const [webUri, setWebUri] = useState(null);
  if (!products.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>See what others are buying</Text>
      <FlatList
        horizontal
        data={products}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductTile
            product={item}
            onPress={() => {
              setWebUri(item.productPageUrl);
              // stubbed behaviour – in real app we would navigate to product page
            }}
            onRemove={() => onRemove(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* WebView modal */}
      <Modal visible={!!webUri} animationType="slide">
        <View style={{ flex: 1 }}>
          <Pressable style={styles.closeBtn} onPress={() => setWebUri(null)}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          {webUri && (
            <WebView
              // ref={WEBVIEW_REF}
              source={{ uri: webUri }}
              startInLoadingState
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default LatestPurchasesTile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeBtn: {
    position: 'absolute',
    zIndex: 2,
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFF',
    fontSize: 18,
  },
});
