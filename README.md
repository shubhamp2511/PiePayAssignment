# About PiePay
PiePay helps online shoppers unlock the best bank offers without needing to own specific credit cards by showing the best deals on e-commerce platforms.

# Project Overview
This project includes:

Frontend: React Native Android app displaying Flipkart pages and fetching deal data.

Backend: Node.js + Express TypeScript API to store and serve scraped product deal data.

# SetUp Instructions

### Prerequisites
    Node.js (version 18 or higher recommended)

    Yarn package manager

    Android SDK and emulator/device for running React Native Android app

# Frontend Setup (React Native - Android)

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Getting Started

> **Note:** The project is configured for **Yarn**. Please use `yarn` commands instead of `npm`.

### Step 1: Install dependencies

Run the following command once to install all project packages:

```sh
yarn install
```

### Step 2: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
yarn start
```

### Step 3: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

#### Android

```sh
yarn android
```
# Backend Setup (API Server)

### Step 1. Navigate to Backend folder

```sh
cd backend
```
### Step 2. Install Dependencies

```sh
npm install
```

### Step 3. Start the backend server

```sh
npm start
```

The backend API will run at http://localhost:3000.

# API Details

## POST /api/prices

### Request Body:-

```sh
   {
  "productTitle": "string", // API friendly title with underscores
  "wowDealPrice": "string|null" // Price extracted from Flipkart or null
   }
```
Stores the price data in-memory.

## GET /api/prices/:productTitle

### Response:-

```sh
   {
  "flipkartPrice": 5000, // Static price
  "wowDealPrice": "string|null", // Returned wow deal or fallback to flipkartPrice
  "productImgUri": "string", // Sample image URI
  "savingsPercentage": 20 // Discount percentage or 0 if no deal
  }
```

# Assumptions
Flipkart price is static (5000) for demo purposes.

Product images use a sample static URI, not live Flipkart images.

Scraped product titles are sanitized: lowercase, no special characters, spaces replaced with underscores.

Data is stored in-memory; no persistent storage.

Remote images falling back to local assets if failed to load.

WebView scraping is based on current Flipkart DOM, may require updates if site changes.

React Native frontend targets Android only.

# Bug Fixes and Improvements Implemented

Broken logo & category image fallback: Added image error handlers and local fallbacks.

WebView modal dismissal: Android hardware back button closes modal correctly.

Performance:

Replaced ScrollView with FlatList for merchant list rendering.

Memoized EcomTile component to avoid unnecessary re-renders.

Immutable state updates for product removal in latest purchases.

Auto-hide BottomSheet: Shows on Flipkart product pages only with a 2-minute countdown.

# What I Would Improve with More Time

Persist backend data in a database (e.g., MongoDB) to retain deals beyond restarts.

Implement more resilient frontend scraping that adapts to Flipkart UI changes.

Add comprehensive error handling and user feedback in the frontend.

Expand to support multiple merchants beyond Flipkart and include iOS support.

Add automated testing on backend and frontend.

Improve UI styling per Figma with animation and accessibility.

# Disclaimer

This project contains web scraping only for evaluation purposes. Please scrape responsibly and comply with Flipkart’s terms of service. PiePay does not endorse misuse of scraping technologies.

This README gives a clear overview of your project, setup instructions, architectural notes, and implementation highlights tailored to the assignment’s requirements and your solution changes.


