import { StyleSheet, View, FlatList } from "react-native"
import Modal from "react-native-modal"
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { useRouter } from "expo-router"
import LateralMenuItem from "./LateralMenuItem"
import { appStyle } from "@styles/appStyle"

import { logout } from "@reducers/user";
import { deleteInformations } from "@reducers/planning"
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from 'expo-secure-store';


export default function LateralMenu({ menuVisible, setMenuVisible, screenHeight, screenWidth, modalOffsetTop, freeHeight }) {

    const router = useRouter()
    const isConnected = useSelector((state) => state.user.value.isConnected)
    const role = useSelector((state) => state.user.value.role)
    const dispatch = useDispatch()
    const logoutUser = async () => {
        router.replace("/")
        dispatch(logout())
        dispatch(deleteInformations())
        await SecureStore.deleteItemAsync('jwtToken')
    }

    const sectionsArray = [
        { sectionName: "Accueil", link: "/" },
        { sectionName: isConnected ? "Se déconnecter" : "Se connecter / S'inscrire", link: isConnected ? "/" : "/login", func: isConnected ? logoutUser : null },
    ]

    if (isConnected){
        sectionsArray.splice( 1, 0,
        { sectionName: "Mes informations", link: "/user-profile" },
    )
    }

    if (role === "owner" || role === "admin") sectionsArray.splice( 1, 0,
        { sectionName: "Modèles de RDV", link: "/appointments-types" },
        { sectionName: "Liste des utilisateurs", link: "/users" },
    )

    role && role !== "client" && sectionsArray.splice( 1, 0,
        { sectionName: "Agenda", link: "/days-schedule" },
    )


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
                    style={{ flex: 1 }}
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