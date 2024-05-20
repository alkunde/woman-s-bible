import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type Props = TouchableOpacityProps & {
  num: string;
  total: string;
  texto: string;
  fontSize: number;
}

export function Verse({ num, texto, total, fontSize, ...rest }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={{ marginBottom: 8 }} {...rest}>
      <Text style={{ fontWeight: "700", fontSize: fontSize }}>
        {num}
        {`  `}
        <Text style={{ fontWeight: "300", fontSize: fontSize }}>
          {texto}
        </Text>
      </Text>

      {total != num && <View style={{ height: 1, backgroundColor: "#FF699B", marginTop: 8, marginHorizontal: 8 }} />}
    </TouchableOpacity>
  );
}