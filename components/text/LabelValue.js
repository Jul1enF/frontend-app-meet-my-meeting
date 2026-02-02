import { View, Text } from "react-native"
import { useState } from "react"

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

export default function LabelValue({ label, details, underlineOffset = phoneDevice ? RPW(1) : 10, underlineHeight = phoneDevice ? 3 : 4.5, underlineColor = appStyle.strongBlack, labelStyle, detailsStyle, index, lastIndex, margin = phoneDevice ? RPW(1.5) : 12, marginMult = 0, extraSpace = true }) {

  // The lineHeight in labelStyle (if define with a number) will override the one in detailsStyle
  // So the best is to put it in "auto" to define the underlineOffset with the eponymous var and set a lineHeight to detailsStyle to determine the gap between lines



  // If the Text is mutiline, we enhanced the top position of the one under (that is not directly under underlined text) so that it looks more consistent to the eye
  const [linesLength, setLinesLenght] = useState(0)
  const [linesHeight, setLinesHeight] = useState(0)
  const [textHeight, setTextHeight] = useState(0)

  const isMultiline = linesLength > 1 && Math.abs(linesHeight - textHeight) < 1
  const marginBottom = (isMultiline && index !== lastIndex) ? margin * marginMult : margin


  // Breaking of long words for IOS
  const breakLongWords = (text) =>
    text.toString().replace(/(.{5})/g, "$1\u200B")

  return (
    <View style={{ position: "relative", minWidth: "50%", marginBottom, paddingRight: phoneDevice ? 2 : 3 }}>


      {/* Invisible label text (opacity : 0) to have it's width and put an absolute underlining View */}
      <View style={[{ borderBottomColor: underlineColor, borderBottomWidth: underlineHeight, position: "absolute", paddingBottom: underlineOffset }]} >
        <Text
          style={[labelStyle, { opacity: 0,  textAlign :"left" }]}
        >
          {label}
        </Text>
      </View>



      <Text style={[detailsStyle, { textAlign :"left"}]} onTextLayout={(e) => {
        const lines = e.nativeEvent.lines
        const height = lines.reduce((acc, line) => acc + line.height, 0)
        setLinesLenght(prev => prev !== lines.length ? lines.length : prev)
        setLinesHeight(prev => prev !== height ? height : prev)
      }}
        onLayout={(e) => {
          const height = e.nativeEvent.layout.height
          setTextHeight(prev => prev !== height ? height : prev)
        }}
      >
        <Text
          style={[labelStyle, { textAlign :"left" }]}
        >
          {label}
        </Text>
        {" "}
        {extraSpace && " "}
        {breakLongWords(details)}
      </Text>

    </View>
  )
}
