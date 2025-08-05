import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, BackHandler, ActivityIndicator, Platform } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import BottomSheet from '@gorhom/bottom-sheet'; // Install this package or use any bottom sheet lib

const FLIPKART_BASE = 'https://www.flipkart.com/';

// Sample static Flipkart price and image (backend will serve real API)
const BACKEND_API_BASE = 'http://localhost:3000'; // change to your backend address

const WebViewScreen = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState<{
    flipkartPrice: number;
    wowDealPrice: string | null;
    productImgUri: string;
    savingsPercentage: number;
  } | null>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const webViewRef = useRef<WebView>(null);

  // Utility to clean title string for API use
  const apiFriendlyTitle = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ /g, '_');

  // Injected JS: scrape wow deal and title, post message to RN
  const injectedJS = `
    (function() {
      function getText(selector) {
        const el = document.querySelector(selector);
        return el ? el.innerText.trim() : null;
      }
      const title = getText('span.B_NuCI') || getText('span._35KyD6') || '';
      const wowDeal = getText('.CEmiEU') || getText('._30jeq3') || null;
      window.ReactNativeWebView.postMessage(JSON.stringify({
        title: title.substring(0, 20),
        wowDeal
      }));
    })();
    true;
  `;

  // On WebView URL navigation state change
  const onNavigationStateChange = (navState: any) => {
    setCurrentUrl(navState.url);
    // Hide bottom sheet if user navigates away from product page
    if (!navState.url.startsWith(FLIPKART_BASE) || !isProductPage(navState.url)) {
      setBottomSheetVisible(false);
      clearCountdownTimer();
      setPriceData(null);
    }
  };

  // Check if URL is Flipkart product page (basic check)
  const isProductPage = (url: string) => {
    // For example, Flipkart product pages usually have /p/
    return url.includes('/p/');
  };

  // Handle message from WebView (scraped data)
  const onMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const title = apiFriendlyTitle(data.title || '');
      const wowDealPrice = data.wowDeal || null;

      // POST scraped data to backend
      setLoading(true);
      await fetch(`${BACKEND_API_BASE}/api/prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productTitle: title, wowDealPrice }),
      });

      // GET processed data to show
      const resp = await fetch(`${BACKEND_API_BASE}/api/prices/${title}`);
      if (resp.ok) {
        const json = await resp.json();
        setPriceData(json);
        setBottomSheetVisible(true);
        startCountdownTimer();
      } else {
        setPriceData(null);
        setBottomSheetVisible(false);
      }
    } catch (e) {
      setPriceData(null);
      setBottomSheetVisible(false);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer for 2 minutes to auto-hide bottom sheet
  const startCountdownTimer = () => {
    clearCountdownTimer();
    timerRef.current = setTimeout(() => {
      setBottomSheetVisible(false);
      setPriceData(null);
    }, 2 * 60 * 1000); // 2 minutes in ms
  };

  const clearCountdownTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Android hardware back button: close bottom sheet or exit WebViewScreen
  useEffect(() => {
    const backAction = () => {
      if (bottomSheetVisible) {
        setBottomSheetVisible(false);
        clearCountdownTimer();
        return true; // consumed event
      }
      return false; // propagate
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
      clearCountdownTimer();
    };
  }, [bottomSheetVisible]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: FLIPKART_BASE }}
        onNavigationStateChange={onNavigationStateChange}
        injectedJavaScript={isProductPage(currentUrl) ? injectedJS : ''}
        onMessage={onMessage}
        startInLoadingState={true}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
      {bottomSheetVisible && priceData && (
        <BottomSheet snapPoints={['30%']} index={0}>
          <View style={styles.bottomSheetContent}>
            <Text style={styles.title}>Deal Info</Text>
            <Text>Flipkart Price: ₹{priceData.flipkartPrice}</Text>
            <Text>Wow Deal Price: ₹{priceData.wowDealPrice ?? priceData.flipkartPrice}</Text>
            <Text>Savings: {priceData.savingsPercentage}%</Text>
            <Text>Sample Image:</Text>
            {/* Show image with example URI */}
            <View style={{ height: 100, marginTop: 10 }}>
              <img src={priceData.productImgUri} alt="Product" style={{ height: '100%', width: '100%' }} />
            </View>
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetContent: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default WebViewScreen;
