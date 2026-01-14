import { View, Text } from "react-native"
import { useState } from "react"

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

export default function LabelValue ({ label, details, underlineOffset = phoneDevice ? RPW(1) : 10, underlineHeight = phoneDevice ? 3 : 4.5, underlineColor = appStyle.strongBlack, labelStyle, detailsStyle, index, lastIndex, margin = phoneDevice ? RPW(1.5) : 12 }) {

  // The lineHeight in labelStyle (if define with a number) will override the one in detailsStyle
  // So the best is to put it in "auto" to define the underlineOffset with the eponymous var and set a lineHeight to detailsStyle to determine the gap between lines

  

  // If the Text is mutiline, we enhanced the top position of the one under (that is not directly under underlined text) so that it looks more consistent to the eye
 const [isMultiline, setIsMultiline] = useState(false)
 const marginBottom = (isMultiline && index !== lastIndex) ? 0 : margin

  return (
    <View style={{ position: "relative", minWidth : "50%", marginBottom, paddingRight : phoneDevice ? 2 : 3 }}>


      {/* Invisible label text (opacity : 0) to have it's width and put an absolute underlining View */}
      <View style={[{borderBottomColor: underlineColor, borderBottomWidth: underlineHeight, position : "absolute", paddingBottom : underlineOffset }]} >
        <Text
          style={[labelStyle, {opacity : 0} ]}
        >
          {label}
        </Text>
      </View>


      <Text style={detailsStyle} onTextLayout={(e)=> setIsMultiline(e.nativeEvent.lines.length > 1)}>
        <Text
          style={labelStyle}
        >
          {label}
        </Text>
        {"  "}
        {details}
      </Text>
  
    </View>
  )
}
