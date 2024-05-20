import { ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type IconProps = TouchableOpacityProps & {
  children: ReactNode;
}

export function Icon({ children, ...rest }: IconProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ width: 56, justifyContent: "center", alignItems: "center" }}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}