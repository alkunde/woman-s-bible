import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { AdsConsent, AdsConsentStatus, BannerAdSize, GAMBannerAd, TestIds } from "react-native-google-mobile-ads";

const adId = Platform.select({
  android: "ca-app-pub-3200984351467142/4121512481",
  ios: "ca-app-pub-3200984351467142/9321868275",
  default: "",
});

export function Advertise() {
  const [personalized, setPersonalized] = useState(true);

  useEffect(() => {
    async function prepare() {
      const consentInfo = await AdsConsent.requestInfoUpdate();
      if (consentInfo.status === AdsConsentStatus.OBTAINED) {
        setPersonalized(false);
      }
    }

    prepare();
  }, []);

  return (
    <GAMBannerAd
      unitId={__DEV__ ? TestIds.GAM_BANNER : adId}
      sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER, BannerAdSize.BANNER]}
      requestOptions={{ requestNonPersonalizedAdsOnly: personalized }}
    />
  );
}