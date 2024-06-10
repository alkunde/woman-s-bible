import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Slot, SplashScreen } from "expo-router";
import { AdEventType, AdsConsent, AdsConsentStatus, AppOpenAd, TestIds } from "react-native-google-mobile-ads";

export default function RootLayout() {
  const [onComplete, setOnComplete] = useState(false);

  const appOpenId = Platform.select({
    android: "ca-app-pub-3200984351467142/2808430816",
    ios: "ca-app-pub-3200984351467142/5432339124",
    default: "",
  });

  const appOpenAd = AppOpenAd.createForAdRequest(
    __DEV__ ? TestIds.APP_OPEN : appOpenId,
    { requestNonPersonalizedAdsOnly: true }
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
    async function prepare() {
      if (onComplete) {
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [onComplete]);

  useEffect(() => {
    async function prepare() {
      SplashScreen.preventAutoHideAsync();

      // const consentInfo = await AdsConsent.requestInfoUpdate();
      // console.log(consentInfo);
      // if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
      //   await AdsConsent.showForm();
      // }

      appOpenAd.load();
    }

    prepare();
  }, []);

  // useEffect(() => {
  //   checkPermissions();
  // }, []);

  // const checkPermissions = async () => {
  //   const consentInfo = await AdsConsent.requestInfoUpdate();
  //   console.log(consentInfo);
  //   if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
  //     await AdsConsent.showForm();
  //   }
  // }

  if (!onComplete) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return <Slot />;
}
