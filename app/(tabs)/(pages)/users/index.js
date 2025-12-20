import { View, StyleSheet, Text, FlatList, RefreshControl, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState, useRef, useMemo } from "react";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import request from "@utils/request";
import { useSelector } from "react-redux";
import useSortUsers from "@components/pages/user-pages/owner-side/useSortUsers";

import UserItem from "@components/pages/user-pages/owner-side/UserItem";
import HorizontalMenu from "@components/ui/HorizontalMenu";
import GoingBackHeader from "@components/ui/GoingBackHeader";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons"

import useLayoutSpaces from "@hooks/useLayoutSpaces"
import Modal from "react-native-modal"
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import UserProfile from "@components/pages/user-pages/owner-side/UserProfile";

export default function UsersPage() {
    const jwtToken = useSelector((state) => state.user.value.jwtToken)
    const [allUsers, setAllUsers] = useState(null)
    const [warning, setWarning] = useState({})
    const [searchText, setSearchText] = useState("")
    const [selectedRole, setSelectedRole] = useState("allUsersRoles")

    // LOAD USERS FUNCTION AND USEEFFECT
    const fetchUsers = async (clearEtag) => {
        const data = await request({ path: "pros/get-all-users", jwtToken, clearEtag, setWarning })
        if (data) {
            setAllUsers(data.allUsers)
        }
    }

    useEffect(() => {
        fetchUsers(true)
    }, [])
 

    // USER MODAL SET UP

    const { freeHeight, screenHeight, screenWidth } = useLayoutSpaces(true)
    const [userModalVisible, setUserModalVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    // Users sorted by roles
    const usersByRoles = useSortUsers(allUsers, searchText)

    // USERS FLATLIST SET UP

    const usersFlatlistRef = useRef(null)

    // Refresh component for the flatlist

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={[appStyle.strongBlack]} progressBackgroundColor={appStyle.pageBody.backgroundColor} tintColor={appStyle.strongBlack} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        fetchUsers()
    }} />

    const usersListHeader = () => {
        return (
            <View style={{ paddingTop: appStyle.pagePaddingTop }}>
                <Text style={appStyle.pageTitle}>
                    Liste des utilisateurs
                </Text>

                <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop : 0 }]}>
                    {warning?.text}
                </Text>
            </View>
        )
    }

    const usersToDisplay = usersByRoles[selectedRole]?.users ?? [];

    return (
        <>
            <View style={[appStyle.pageBody, { paddingBottom: 0, paddingTop: 0 }]}>
                <HorizontalMenu data={usersByRoles} chosenItem={selectedRole} setChosenItem={setSelectedRole} categoryType="role" countProp="priority" />

                <View style={styles.searchContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[appStyle.input.withIcon, appStyle.secondHeaderText]}
                            value={searchText}
                            onChangeText={(e) => setSearchText(e)}
                            autoCapitalize='none'
                            placeholder='Rechercher un utilisateur...'
                        >
                        </TextInput>

                        <FontAwesome name="search" size={appStyle.inputIconSize} color={appStyle.strongBlack} />
                    </View>

                    <MaterialDesignIcons name="backspace" size={appStyle.inputIconSize} color={appStyle.strongBlack} onPress={() => setSearchText("")} />
                </View>

                <FlatList
                    data={usersToDisplay}
                    refreshControl={refreshComponent}
                    ref={usersFlatlistRef}
                    onScrollToIndexFailed={(event) => {
                        usersFlatlistRef.current.scrollToIndex({ animated: false, index: event.index })
                    }}
                    ListHeaderComponent={usersListHeader}
                    ListHeaderComponentStyle={{ marginBottom: phoneDevice ? RPW(7) : 45 }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => <TouchableOpacity
                        onPress={() => {
                            setUserModalVisible(true)
                            setSelectedUser(item)
                        }}>
                        <UserItem {...item} index={index} />
                    </TouchableOpacity>}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ alignItems: 'center', paddingBottom: appStyle.pagePaddingBottom }}
                />

                <Modal
                    isVisible={userModalVisible}
                    style={[styles.modal, { maxHeight: freeHeight, top: 0, width: "100%" }]}
                    coverScreen={false}
                    backdropColor="transparent"
                    animationIn="slideInRight"
                    animationOut="slideOutRight"
                    onBackButtonPress={() => setUserModalVisible(false)}
                    deviceWidth={screenWidth}
                    deviceHeight={screenHeight}
                >
                    <AutocompleteDropdownContextProvider>

                        <GoingBackHeader previousPageName="Liste des utilisateurs" leftFunction={() => setUserModalVisible(false)} />

                        <ScrollView style={{ minWidth: "100%" }} contentContainerStyle={{ backgroundColor: appStyle.pageBody.backgroundColor, minHeight: freeHeight }} bounces={false} overScrollMode="never" >
                            <UserProfile selectedUser={selectedUser} jwtToken={jwtToken} setAllUsers={setAllUsers} />
                        </ScrollView>

                    </AutocompleteDropdownContextProvider>
                </Modal>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: appStyle.secondHeaderHeight,
        paddingHorizontal: appStyle.secondHeaderHorizPadd,
        paddingTop: phoneDevice ? RPW(1) : 6,
        width: "100%",
    },
    inputContainer: {
        width: phoneDevice ? RPW(68) : 450,
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: phoneDevice ? 2 : 3,
        borderBottomColor: appStyle.strongRed,
    },
    modal: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        margin: 0,
    },
})