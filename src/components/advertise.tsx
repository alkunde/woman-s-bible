import { Platform } from "react-native";
import { BannerAdSize, GAMBannerAd, TestIds } from "react-native-google-mobile-ads";

const adId = Platform.select({
  android: "ca-app-pub-3200984351467142/4121512481",
  ios: "ca-app-pub-3200984351467142/9321868275",
  default: "",
});

export function Advertise() {

  return (
    <GAMBannerAd
      unitId={__DEV__ ? TestIds.GAM_BANNER : adId}
      sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER, BannerAdSize.BANNER]}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
    />
  );
}