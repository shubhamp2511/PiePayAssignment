// EcomTile.tsx
import React, { useState, memo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
  BackHandler,
} from 'react-native';
import WebView from 'react-native-webview';

const windowWidth = Dimensions.get('window').width;
const itemsPerRow = 4;
const circleSize = windowWidth * 0.2; // 20% of width

// Fallback images (replace these with your local asset paths or URLs)
const fallbackLogo = require('../assets/fallback_logo.png');
const fallbackCategory = require('../assets/fallback_category.png');

// Memoized CategoryItem to handle individual image errors
const CategoryItem = memo(({ cat, onPress }: { cat: any; onPress: () => void }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Pressable style={styles.circle} onPress={onPress}>
      <Image
        source={imgError ? fallbackCategory : { uri: cat.imageUrl }}
        style={styles.categoryImage}
        onError={() => setImgError(true)}
      />
      <Text style={styles.categoryTitle}>{cat.title}</Text>
    </Pressable>
  );
});

interface Merchant {
  name: string;
  categories: any[];
  logoUrl: string;
}

interface EcomTileProps {
  merchant: Merchant;
  onPress?: () => void;
}

const EcomTile = memo(({ merchant, onPress }: EcomTileProps) => {
  const { name, logoUrl } = merchant;

  // Avoid mutating merchant.categories directly
  let categories = merchant.categories || [];
  const [expanded, setExpanded] = useState(false);
  const [webUri, setWebUri] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  // Add "More" category only once without mutating original array
  const categoriesWithMore =
    categories.length && !categories.some((cat) => cat.title === 'More')
      ? [...categories, { title: 'More', imageUrl: 'https://img.icons8.com/fluency/96/000000/more.png' }]
      : categories;

  // Limit categories shown by default before expansion
  const visibleCategories = expanded ? categoriesWithMore : categoriesWithMore.slice(0, 7);

  // Split visible categories into rows
  const rows: any[] = [];
  for (let i = 0; i < visibleCategories.length; i += itemsPerRow) {
    rows.push(visibleCategories.slice(i, i + itemsPerRow));
  }

  const handleToggle = () => setExpanded(!expanded);

  // Android hardware back button handler to close modal
  useEffect(() => {
    const backHandler = () => {
      if (webUri) {
        setWebUri(null);
        return true; // Prevent default behavior
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', backHandler);
    return () => BackHandler.removeEventListener('hardwareBackPress', backHandler);
  }, [webUri]);

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <View style={styles.headerRow}>
          <Image
            source={logoError ? fallbackLogo : { uri: logoUrl }}
            style={styles.logo}
            onError={() => setLogoError(true)}
          />
          <Text style={styles.headerText}>Buy on {name}</Text>
        </View>
      </Pressable>

      {/* category grid rows */}
      {rows.map((row, rowIdx) => (
        <View
          key={`row-${rowIdx}`}
          style={[styles.row, { justifyContent: row.length < 3 ? 'flex-start' : 'space-between' }]}
        >
          {row.map((cat, idx) => (
            <CategoryItem
              key={`cat-${idx}`}
              cat={cat}
              onPress={() => {
                if (cat.productPageUrl) {
                  setWebUri(cat.productPageUrl);
                }
              }}
            />
          ))}
        </View>
      ))}

      {/* view more / less toggle */}
      {categoriesWithMore.length > 7 && (
        <Pressable onPress={handleToggle} style={styles.viewMoreBtn}>
          <Text style={styles.viewMoreText}>{expanded ? 'View less' : 'View more'}</Text>
        </Pressable>
      )}

      {/* WebView modal */}
      <Modal visible={!!webUri} animationType="slide">
        <View style={{ flex: 1 }}>
          <Pressable style={styles.closeBtn} onPress={() => setWebUri(null)}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          {webUri && <WebView source={{ uri: webUri }} startInLoadingState />}
        </View>
      </Modal>
    </View>
  );
});

export default EcomTile;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    height: 20,
    width: 20,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  circle: {
    width: circleSize,
    alignItems: 'center',
  },
  categoryImage: {
    width: circleSize * 0.8,
    height: circleSize * 0.8,
    borderRadius: circleSize * 0.4,
    backgroundColor: '#FFF',
  },
  categoryTitle: {
    marginTop: 6,
    fontSize: 12,
    color: '#616161',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  viewMoreBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewMoreText: {
    color: '#6C33DB',
    fontSize: 14,
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
