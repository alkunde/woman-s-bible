import { ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  children: ReactNode;
}

export function Icon({ children, ...rest }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        width: 56,
        justifyContent: "center",
        alignItems: "center",
      }}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}