import { TextInput, View, StyleSheet, Text } from "react-native";

export default function MyTextInput({ style, onChangeText, value, autoCapitalize, placeholder, placeholderTextColor, secureTextEntry, keyboardType, children }) {

    const styleObject = StyleSheet.flatten(style) ?? {}

    const { minHeight, paddingTop, paddingBottom, width, height, maxHeight, maxWidth, borderRadius, marginTop, paddingHorizontal, borderColor, borderWidth, backgroundColor, paddingLeft, borderBottomWidth, borderBottomColor, ...fontStyle } = styleObject

    const fontSize = styleObject.fontSize ?? 16;
    const lineHeight = Math.round(fontSize * 1.25);

    return (
        <View style={[styles.mainContainer, styleObject?.marginTop !== undefined && { marginTop: styleObject?.marginTop }]}>

            <View style={[{
                position: "absolute",
                height: "100%",
                justifyContent: "center",
                paddingLeft: styleObject.paddingLeft ?? styleObject.paddingHorizontal ?? 0,
                paddingRight: styleObject.paddingRight ?? styleObject.paddingHorizontal ?? 0,
            }]}>
                <Text style={[fontStyle,
                    {
                        color: placeholderTextColor,
                        fontWeight: "500",
                        fontSize,
                        lineHeight,
                    },
                    value && { display: "none" }]}
                    numberOfLines={1}
                >
                    {placeholder}
                </Text>
            </View>



            <TextInput
                value={value}
                onChangeText={onChangeText}
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                placeholder="\u200B"
                placeholderTextColor="transparent"
                includeFontPadding={false}
                textAlignVertical="center"
                multiline={false}
                numberOfLines={1}
                style={[styleObject, { fontSize, lineHeight, marginTop: 0}]}
            />


            {children &&
                [children]
            }
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: "center",
    },
})