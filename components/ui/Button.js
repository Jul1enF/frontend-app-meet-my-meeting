import { TouchableOpacity, Text } from "react-native";
import { appStyle } from '@styles/appStyle.js';


export default function Button({ func, text, border, color = appStyle.fontColorDarkBg, fontWeight = "500", style, fontStyle }) {
  return (
    <TouchableOpacity style={[
      appStyle.button,
      appStyle.regularItem,
      border ? border : {},
      { backgroundColor: !border ? appStyle.strongRed : "transparent" },
      style && style,
    ]}
      onPress={func} activeOpacity={0.6}
    >
      <Text style={[
        appStyle.regularText,
        { color, fontWeight, textAlign : "center" },
        fontStyle && fontStyle
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}