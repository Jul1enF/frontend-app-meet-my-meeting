import { TouchableOpacity, Text } from "react-native";
import { appStyle } from '@styles/appStyle.js';
import { fontsStyle } from "@styles/fontsStyle";


export default function Button({ func, text, itemStyle = appStyle.regularItem, border, bgColor = appStyle.strongRed, padding, color = appStyle.fontColorDarkBg, marginTop, fontWeight = "500", style, fontStyle }) {
  return (
    <TouchableOpacity style={[
      appStyle.button,
      itemStyle,
      marginTop !== undefined ? { marginTop } : {},
      border ? border : {},
      { backgroundColor: !border ? bgColor : "transparent" },
      padding && { width: "auto", paddingHorizontal: padding },
      style && style,
    ]}
      onPress={func} activeOpacity={0.6}
    >
      <Text style={[
        appStyle.regularText,
        { color, fontWeight },
        fontStyle && fontStyle
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}