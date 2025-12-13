import { TouchableOpacity, Text } from "react-native";
import { appStyle } from 'styles/appStyle.js';


export default function Button ({func, text, itemStyle = appStyle.regularItem, border, bgColor = appStyle.strongRed, padding, color = appStyle.fontColorDarkBg, marginTop}) {
    return (
        <TouchableOpacity style={[
          appStyle.button, 
          itemStyle,
          marginTop !== undefined ? {marginTop} : {},
          border ? border : {}, 
          {backgroundColor : !border ? bgColor : "transparent"},
          padding && {width : "auto", paddingHorizontal : padding}
          ]} 
          onPress={func} activeOpacity={0.6}
          >
        <Text style={[appStyle.regularText, {color, fontWeight : "500"}]}>{text}</Text>
      </TouchableOpacity>
    )
}