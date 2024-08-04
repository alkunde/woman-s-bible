import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  children: ReactNode;
}

export function Icon({ children, ...rest }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
});