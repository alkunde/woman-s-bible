import "react-native-reanimated";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  AdEventType,
  AdsConsent,
  AdsConsentStatus,
  AppOpenAd,
  TestIds,
} from "react-native-google-mobile-ads";
import crashlytics from "@react-native-firebase/crashlytics";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ADS_SHOW_STORAGE = "@womans-bible-gracetech:ads-show";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [loaded] = useFonts({
  //   ...FontAwesome.font,
  //   ...MaterialIcons.font,
  // });

  const [onComplete, setOnComplete] = useState(false);
  const [personalized, setPersonalized] = useState(true);

  const appOpenId = Platform.select({
    android: "ca-app-pub-3200984351467142/2808430816",
    ios: "ca-app-pub-3200984351467142/5432339124",
    default: "",
  });

  const appOpenAd = AppOpenAd.createForAdRequest(
    __DEV__ ? TestIds.APP_OPEN : appOpenId,
    { requestNonPersonalizedAdsOnly: personalized }
  );

  appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
    appOpenAd.show();
  });

  appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
    setOnComplete(true);
  });

  appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
    setOnComplete(true);
  });

  useEffect(() => {
    if (onComplete) {
      SplashScreen.hideAsync();
    }
  }, [onComplete]);

  useEffect(() => {
    async function prepare() {
      try {
        const consentInfo = await AdsConsent.requestInfoUpdate();
        if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
          await AdsConsent.showForm();
        }
  
        const showAds = await AsyncStorage.getItem(ADS_SHOW_STORAGE);
        if (showAds) {
          if (consentInfo.status === AdsConsentStatus.OBTAINED) {
            setPersonalized(false);
          }
          if (showAds === "true") {
            appOpenAd.load();
          }
        } else {
          setOnComplete(true);
          await AsyncStorage.setItem(ADS_SHOW_STORAGE, "true");
        }
      } catch (error) {
        crashlytics().recordError(error as any);
        setOnComplete(true);
      }
    }

    prepare();
  }, []);

  if (!onComplete) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return <Slot />;
}
