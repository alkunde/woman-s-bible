import "react-native-reanimated";
import { useEffect, useState } from 'react';
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Slot />
  );
}
