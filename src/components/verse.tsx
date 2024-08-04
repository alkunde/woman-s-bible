import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

import theme from "../styles/theme";

type Props = TouchableOpacityProps & {
  num: string;
  total: string;
  texto: string;
  fontSize: number;
}

export function Verse({ num, texto, total, fontSize, ...rest }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      {...rest}
    >
      <Text
        style={[styles.textNumber, { fontSize: fontSize }]}
      >
        {num}
        {`  `}
        <Text
          style={[styles.textVerse, { fontSize: fontSize }]}
        >
          {texto}
        </Text>
      </Text>

      {total != num && <View style={styles.divider} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  textNumber: {
    fontWeight: "700",
  },
  textVerse: {
    fontWeight: "300",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.primary_light,
    marginTop: 8,
    marginHorizontal: 8
  },
});