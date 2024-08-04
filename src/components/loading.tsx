import { ActivityIndicator, StyleSheet, View } from "react-native";

import theme from "../styles/theme";

export function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary_light} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});