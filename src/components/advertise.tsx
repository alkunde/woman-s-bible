import { Platform } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

const adId = Platform.select({
  android: "ca-app-pub-3200984351467142/4121512481",
  ios: "ca-app-pub-3200984351467142/9321868275",
  default: "",
});

export function Advertise() {
  return (
    <BannerAd
      unitId={__DEV__ ? TestIds.ADAPTIVE_BANNER : adId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
    />
  );
}