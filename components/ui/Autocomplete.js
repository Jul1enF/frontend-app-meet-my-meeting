import { StyleSheet, Text, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';

export default function Autocomplete({ data, setSelectedItem, placeholderText, width, height, initialValue, emptyText, inputStyle, suggestionTextStyle, canCreate }) {
    const inputWidth = width ?? appStyle.largeItemWidth
    const inputHeight = height ?? appStyle.largeItemHeight
    
    return (
        <AutocompleteDropdown
            dataSet={data}
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={true}
            emptyResultText={emptyText}
            initialValue={initialValue ? initialValue : {}}
            onSelectItem={(item) => setSelectedItem(item)}
            onClear={() => setSelectedItem(null)}
            onChangeText={(e)=> canCreate && setSelectedItem({ title: e })}
            onSubmit={(e) => {
                const text = e.nativeEvent.text.toLowerCase()
                const foundItem = data.find( elem => elem.title.toLowerCase() === text )
                if (foundItem) {
                    setSelectedItem(foundItem)
                } else if (canCreate) {
                    setSelectedItem({ title: e.nativeEvent.text })
                }
            }}
            suggestionsListMaxHeight={phoneDevice ? RPW(65) : 300}
            inputContainerStyle={[styles.inputContainer, { height: inputHeight, width: inputWidth }]}
            textInputProps={{
                placeholder: placeholderText,
                autoCorrect: false,
                autoCapitalize: "none",
                placeholderTextColor: appStyle.placeholderColor,
                style: !inputStyle ? styles.autoCompleteInput : { ...styles.autoCompleteInput, ...inputStyle },
            }}
            containerStyle={{ width: inputWidth }}
            suggestionsListContainerStyle={{
                ...styles.suggestionsListContainer,
                width: inputWidth,
            }}
            renderItem={(item) => (
                <View style={[styles.suggestionsListItem, { height: inputHeight }]}>
                    <Text style={[styles.suggestionsListText, suggestionTextStyle && suggestionTextStyle]}>{item.title}</Text>
                </View>
            )}
            EmptyResultComponent={() => (
                <View style={[styles.suggestionsListItem, { height: inputHeight }]}>
                    <Text style={[styles.suggestionsListText, suggestionTextStyle && suggestionTextStyle]}>{emptyText}</Text>
                </View>
            )}
            ChevronIconComponent={
                <FontAwesome5
                    name="chevron-down"
                    color={appStyle.brightGrey}
                    size={phoneDevice ? RPW(4.2) : 23}
                />
            }
            ClearIconComponent={
                <Feather
                    name="x-circle"
                    color={appStyle.brightGrey}
                    size={phoneDevice ? RPW(4.2) : 23}
                    style={{ position: "relative", width: phoneDevice ? RPW(6) : 50 }}
                />
            }
            rightButtonsContainerStyle={{ width: "20%", justifyContent: "flex-end" }}
            ItemSeparatorComponent={
                <View style={{ height: 1, backgroundColor: appStyle.lightGrey }} />
            }
        />
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        ...appStyle.input.base,
        backgroundColor: "transparent",
        alignItems: "center",
    },
    autoCompleteInput: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
        fontWeight: "700",
        paddingBottom: 0,
        paddingTop: 0,
    },
    suggestionsListContainer: {
        backgroundColor: appStyle.strongGrey2,
        borderRadius: appStyle.regularItemBorderRadius,
    },
    suggestionsListItem: {
        justifyContent: "center",
        paddingLeft: phoneDevice ? RPW(3) : 15,
    },
    suggestionsListText: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
    },
})

