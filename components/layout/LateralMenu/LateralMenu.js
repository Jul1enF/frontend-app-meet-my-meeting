import { StyleSheet, View, FlatList } from "react-native"
import Modal from "react-native-modal"
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import LateralMenuItem from "./LateralMenuItem"
import { appStyle } from "@styles/appStyle"

import { logout } from "@reducers/user";
import { useDispatch } from "react-redux";


export default function LateralMenu({ menuVisible, setMenuVisible, screenHeight, screenWidth, modalOffsetTop, freeHeight, jwtToken }) {

    const dispatch = useDispatch()
    const logoutUser = () => dispatch(logout())

    const sectionsArray = [
        { sectionName: "Accueil", link: "/(tabs)/(pages)" },
        { sectionName: jwtToken ? "Se déconnecter" : "Se connecter / S'inscrire", link: jwtToken ? "/" : "/(tabs)/(pages)/login", func: jwtToken ? logoutUser : null },
    ]
    // user.is_admin && sectionsArray.push({ sectionName: "Écrire / Modifier un article", link: "/redaction" })

    return (
        <Modal
            isVisible={menuVisible}
            style={styles.modal}
            backdropColor="transparent"
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            onBackButtonPress={() => setMenuVisible(!menuVisible)}
            onBackdropPress={() => setMenuVisible(!menuVisible)}
            deviceWidth={screenWidth}
            deviceHeight={screenHeight}
        >
            <View style={[styles.menu, { height: freeHeight, top: modalOffsetTop + 0.5 }]}>
                <FlatList
                    data={sectionsArray}
                    renderItem={({ item, index }) => {
                        return <LateralMenuItem {...item} setMenuVisible={setMenuVisible} index={index} key={index} />
                    }}
                    showsVerticalScrollIndicator={false}
                    style={{flex : 1}}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        margin: 0,
    },
    menu: {
        width: phoneDevice ? "85%" : "73.5%",
        backgroundColor: appStyle.lightGrey2,
        position: "absolute",
    },
})