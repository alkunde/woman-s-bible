import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BannerAdSize, GAMBannerAd, TestIds } from "react-native-google-mobile-ads";

const adId = Platform.select({
  android: "ca-app-pub-3200984351467142/4121512481",
  ios: "ca-app-pub-3200984351467142/9321868275",
  default: "",
});

export function Advertise() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 8, paddingBottom: insets.bottom }}>
      <GAMBannerAd
        unitId={__DEV__ ? TestIds.GAM_BANNER : adId}
        sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER, BannerAdSize.BANNER]}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}