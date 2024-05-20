import "react-native-reanimated";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Slot } from "expo-router";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [onComplete, setOnComplete] = useState(true);

  const appOpenId = Platform.select({
    android: "",
    ios: "",
    default: "",
  });

  // const appOpenAd = AppOpenAd.createForAdRequest(
  //   __DEV___ ? TestIds.APP_OPEN : appOpenId,
  //   { requestNonPersonalizedAdsOnly: true }
  // );

  // appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
  //   appOpenAd.show();
  // });

  // appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
  //   setOnComplete(true);
  // });

  // appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
  //   setOnComplete(true);
  // });

  useEffect(() => {
    async function prepare() {
      await requestTrackingPermissionsAsync();

      if (onComplete) {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [onComplete]);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();

      // appOpenAd.load();
    }

    prepare();
  }, []);

  if (!onComplete) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return <Slot />;
}
