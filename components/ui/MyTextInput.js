import { TextInput, View, StyleSheet, Text } from "react-native";

export default function MyTextInput({ style, onChangeText, value, autoCapitalize, placeholder, placeholderTextColor, secureTextEntry, keyboardType, }) {

    const { minHeight, paddingTop, paddingBottom, width, maxWidth, borderRadius, marginTop, paddingHorizontal, borderColor, borderWidth, backgroundColor, paddingLeft, ...fontStyle } = style

    const fontSize = style.fontSize ?? 16;
    const lineHeight = Math.round(fontSize * 1.25);

    return (
        <View style={[styles.mainContainer]}>

            <Text style={[fontStyle, styles.placeHolder,
                {
                    color: placeholderTextColor,
                    fontWeight: "700",
                    fontSize,
                    lineHeight,
                    paddingLeft: style.paddingLeft ?? style.paddingHorizontal ?? 0,
                    paddingRight: style.paddingRight ?? style.paddingHorizontal ?? 0,
                    bottom : style.paddingBottom,
                },
                value && { display: "none" }]}
                numberOfLines={1}
            >
                {placeholder}
            </Text>


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
                style={[style, { fontSize, lineHeight }]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: "center",
    },
    placeHolder: {
        position: "absolute",
    },
})