import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react"
import useDropdownPosition from "./useDropdownPosition";

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

export default function Dropdown({ flatlistData, setSelectedItem, sectionToSelectKey, titleToSelectKey, closeDropdown, emptyResultText, layoutStyle = {}, dropdownMaxHeight, dropdownContainerStyle = {}, dropdownItemStyle = {}, dropdownTextStyle = {}, boldTitleWeight = "700", dropdownLineColor, autocompleteInputRef, tabBar, header, dropdownId, pressEvent, setPressEvent }) {

    // useEffect to reset a potential register value of the location of a tap
    useEffect(()=>{
        setPressEvent(null)
        return () => {
            setPressEvent(null)
        }
    },[])

    // State to register the height of the dropdown
    const [dropdownHeight, setDropdownHeight] = useState(null)

    // Hook to get the dropdown style position
    const dropdownPositionStyle = useDropdownPosition({ dropdownHeight, autocompleteInputRef, tabBar, header, dropdownId, pressEvent, closeDropdown })

    // Item component for the suggestion list
    const textStyle = [styles.dropdownItemText, dropdownTextStyle]

    const DropdownItem = ({ item }) => {
        let title

        if (item) {
            title = titleToSelectKey ? item[titleToSelectKey] :
                typeof item === "string" ? item :
                    item.title
        }

        return (
            <View style={[appStyle.regularItem, { ...layoutStyle }, { ...dropdownItemStyle }, { marginTop: 0 }]} >

                {item &&
                    <Text style={textStyle}>

                        {item.boldTitle &&
                            <Text style={[...textStyle, { fontWeight: boldTitleWeight }]} >
                                {item.boldTitle}
                            </Text>
                        }

                        {item.lightTitle ?? title ?? null}

                    </Text>
                }

                {!item &&
                    <Text style={textStyle}>
                        {emptyResultText}
                    </Text>
                }

            </View>
        )
    }



    return (
        <View
            style={[styles.dropdownContainer, dropdownContainerStyle, { maxHeight: dropdownMaxHeight, overflow: "hidden" }, dropdownPositionStyle]}
            onLayout={(e) => setDropdownHeight(e.nativeEvent.layout.height)}
        >
            <FlatList
                data={flatlistData}
                keyExtractor={(item, index) => {
                    if (sectionToSelectKey && item[sectionToSelectKey]._id) return item[sectionToSelectKey]._id
                    else if (item._id) return item._id
                    else return index
                }}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                }}
                renderItem={({ item, index }) =>
                    <TouchableOpacity onPress={() => {
                        setSelectedItem(sectionToSelectKey ? item[sectionToSelectKey] : item )
                        closeDropdown()
                    }} >
                        <DropdownItem item={item} />
                    </TouchableOpacity>
                }
                ListEmptyComponent={<DropdownItem item={null} />}
                ItemSeparatorComponent={
                    <View style={{ height: 1, backgroundColor: dropdownLineColor }} />
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    dropdownContainer: {
        backgroundColor: appStyle.strongGrey2,
        borderRadius: appStyle.regularItemBorderRadius,
        position: "absolute",
        zIndex: 100,

        // setting of opacity 0 until it's override by dropdownPositionStyle with the accurate position
        opacity: 0,
    },
    dropdownItemText: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
    },
})