import { Text, TouchableOpacity, FlatList, View, StyleSheet } from "react-native";
import { useRef, useEffect } from "react";
import { RPH, RPW, phoneDevice } from "utils/dimensions"
import { appStyle } from "styles/appStyle"
import { router } from "expo-router";

export default function HorizontalMenu({ data, menuBelow, func, name, chosenItem, setChosenItem, categoryType, countProp, length }) {

    const dataArray = Array.isArray(data) ? data :
        length ? Object.values(data).sort((a, b) => b[countProp].length - a[countProp].length) :
            Object.values(data).sort((a, b) => b[countProp] - a[countProp])

    const flatlistRef = useRef(null)

    const scrollToIndex = (delay, selectedIndex = dataArray.findIndex(item => item[categoryType] === chosenItem)) => {
        if (selectedIndex < 0 || !flatlistRef.current) return
        // Delay to ensure flatlist is ready
        setTimeout(() => {
            flatlistRef.current.scrollToIndex({
                index: selectedIndex,
                animated: true,
                viewPosition: 0.5,
            })
        }, delay)
    }

    useEffect(() => {
        scrollToIndex(10)
    }, [chosenItem, dataArray])


    const Item = (props) => {
        const itemSelected = props[categoryType] === chosenItem

        const itemPress = () => {
            setChosenItem(props[categoryType])
            typeof func === "function" && func()
            props.link && router.navigate(props.link)
        }

        return (
            <TouchableOpacity style={[styles.itemBtn, itemSelected ? styles.selectedItemBtn : styles.unselectedItemBtn]} onPress={itemPress}>
                <Text style={[styles.itemText, itemSelected ? styles.selectedItemText : styles.unselectedItemText]}>
                    {name ? props[name] : props.name}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <FlatList
            data={dataArray}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingRight: phoneDevice ? RPW(3.5) : 34 }}
            style={[styles.flatlist, !menuBelow && styles.flatlistBorderBottom]}
            renderItem={({ item, index }) => {
                return <Item {...item} index={index} />
            }}
            ref={flatlistRef}
            onScrollToIndexFailed={(info) => scrollToIndex(100, info.index)}
        />
    )
}

const styles = StyleSheet.create({
    flatlist: {
        minHeight: appStyle.secondHeaderHeight,
        maxHeight: appStyle.secondHeaderHeight,
        minWidth: RPW(100),
        backgroundColor: appStyle.pageBody.backgroundColor
    },
    flatlistBorderBottom: {
        borderBottomColor: appStyle.lightGrey,
        borderBottomWidth: phoneDevice ? 0.5 : 1.5
    },
    itemBtn: {
        marginLeft: phoneDevice ? RPW(3.5) : 34,
        minHeight: "100%",
        justifyContent: "center",
    },
    unselectedItemBtn: {

    },
    selectedItemBtn: {
        borderBottomColor: appStyle.strongBlack,
        borderBottomWidth: phoneDevice ? 5 : 7,
        paddingTop: phoneDevice ? 5 : 7,
    },
    itemText: {
        color: appStyle.strongBlack,
        fontSize: phoneDevice ? RPW(4.15) : 30,
        lineHeight: phoneDevice ? RPW(5) : 35,
    },
    unselectedItemText: {
        fontWeight: "400",
    },
    selectedItemText: {
        fontWeight: "600",
    }
})