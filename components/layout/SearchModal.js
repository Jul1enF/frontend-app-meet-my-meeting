import { View, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Modal from "react-native-modal"
import { RPH, RPW, phoneDevice } from "utils/dimensions"
import { appStyle } from "styles/appStyle";
import { router } from "expo-router";


export default function SearchModal({ searchVisible, setSearchVisible, screenWidth, screenHeight, modalOffsetTop }) {

    const [searchText, setSearchText] = useState('')

    // Function called when a search is submitted

    const submitSearch = () => {
        router.push(`/searches/${searchText}`)
        setSearchText('')
        setSearchVisible(false)
    }

    return (
        <Modal
            isVisible={searchVisible}
            style={styles.modal}
            backdropColor="transparent"
            animationIn="fadeInDown"
            animationOut="fadeOutUp"
            onBackButtonPress={() => setSearchVisible(!searchVisible)}
            onBackdropPress={() => setSearchVisible(!searchVisible)}
            deviceWidth={screenWidth}
            deviceHeight={screenHeight}
        >
            <LinearGradient style={[styles.searchContainer, { top: modalOffsetTop + 0.5 }]}
                colors={[appStyle.strongRed, appStyle.strongBlack]}
                locations={[0, 0.9]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
            >
                <View style={styles.searchInputContainer}>
                    <TextInput
                        style={[styles.search, appStyle.input, { color: appStyle.darkWhite }]}
                        placeholder="Rechercher..."
                        onChangeText={(e) => setSearchText(e)}
                        value={searchText}
                        returnKeyType="send"
                        placeholderTextColor={appStyle.placeholderColor}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onSubmitEditing={() => submitSearch()}
                    ></TextInput>
                    <FontAwesome6 name="magnifying-glass" style={styles.icon} size={phoneDevice ? RPW(4.5) : 25} onPress={() => submitSearch()} />
                </View>
                <FontAwesome6 name="chevron-up" style={styles.icon} size={phoneDevice ? RPW(6) : 28} onPress={() => setSearchVisible(!searchVisible)} />

            </LinearGradient>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        margin: 0,
    },
    searchContainer: {
        position: "absolute",
        height: appStyle.secondHeaderHeight,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal : phoneDevice ? RPW(4) : 30,
    },
    searchInputContainer: {
        borderBottomColor: appStyle.darkWhite,
        borderBottomWidth: phoneDevice ? 0.5 : 1,
        width: "50%",
        paddingBottom: phoneDevice ? RPW(1.5) : 8,
        paddingRight: phoneDevice ? RPW(1) : 8,
        marginTop: phoneDevice ? RPW(0.5) : 4,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
    },
    search: {
        ...appStyle.regularText,
        padding : 0,
        width: "90%",
    },
    icon: {
        color: appStyle.darkWhite,
    },
})