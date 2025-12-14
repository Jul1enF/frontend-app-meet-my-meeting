import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useSegments } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import LateralMenu from "./LateralMenu/LateralMenu";
import ForcedUpdateModal from "./ForcedUpdateModal";
import SearchModal from "./SearchModal";

import { useState } from 'react'
import { useSelector } from "react-redux";
import useLayoutSpaces from "@hooks/useLayoutSpaces"
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle";



export default function Header({appObsolete}) {

    const [menuVisible, setMenuVisible] = useState(false)
    const jwtToken = useSelector((state) => state.user.value.jwtToken)

    const segments = useSegments();
    const tabBar = segments[0] === "(tabs)"

    // Hook for the height/width of the screen (for tablets orientation changes), the height available and detection of android insetTop to use as offset

    const { modalOffsetTop, statusBarOffset, freeHeight, screenHeight, screenWidth } = useLayoutSpaces(tabBar)


    // States for the display of the search modal

    const [searchVisible, setSearchVisible] = useState(false)


        return (
            <View>
                <StatusBar translucent={true} backgroundColor="transparent" barStyle="light" />
                <LinearGradient style={[styles.header, { height: appStyle.headerHeight + statusBarOffset, paddingTop: statusBarOffset }]}
                    colors={[appStyle.strongRed, appStyle.strongBlack]}
                    locations={[0, 0.75]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <View style={styles.menuIconContainer}>
                        <FontAwesome name="navicon" style={styles.icon} size={phoneDevice ? RPW(6) : 38} onPress={() => setMenuVisible(!menuVisible)} />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            Meet My Meeting
                        </Text>
                    </View>
                    <View style={styles.searchIconContainer}>
                        <FontAwesome6 name="magnifying-glass" style={styles.icon} size={phoneDevice ? RPW(6) : 38} onPress={() => setSearchVisible(!searchVisible)} />
                    </View>
                </LinearGradient>
                <View style={styles.headerLigne}></View>
                
                <SearchModal screenHeight={screenHeight} screenWidth={screenWidth} modalOffsetTop={modalOffsetTop} searchVisible={searchVisible} setSearchVisible={setSearchVisible} />

                <LateralMenu menuVisible={menuVisible} setMenuVisible={setMenuVisible} screenHeight={screenHeight} screenWidth={screenWidth} modalOffsetTop={modalOffsetTop} freeHeight={freeHeight} jwtToken={jwtToken} />


                <ForcedUpdateModal screenHeight={screenHeight} screenWidth={screenWidth} appObsolete={appObsolete} freeHeight={freeHeight} modalOffsetTop={modalOffsetTop} />

            </View>
        )
    }


const styles = StyleSheet.create({
    header: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    menuIconContainer: {
        width: "15%",
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: phoneDevice ? RPW(4) : 30,
    },
    titleContainer: {
        width: "70%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: phoneDevice ? RPW(7) : 52,
        color: appStyle.darkWhite,
        letterSpacing: phoneDevice ? 1.5 : 4,
        fontWeight: "600",
        paddingBottom : phoneDevice ? RPW(1) : 4
    },
    searchIconContainer: {
        width: "15%",
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: phoneDevice ? RPW(4) : 30,
    },
    icon: {
        color: appStyle.darkWhite,
    },
    headerLigne: {
        borderBottomColor: appStyle.lightGrey,
        borderBottomWidth: phoneDevice ? 0.5 : 1,
    },
})