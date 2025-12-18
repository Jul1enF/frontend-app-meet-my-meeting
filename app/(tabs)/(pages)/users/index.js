import { View, StyleSheet, Text, FlatList, RefreshControl, TextInput } from "react-native";
import { useEffect, useState, useRef, useMemo } from "react";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import request from "@utils/request";
import { useSelector, useDispatch } from "react-redux";
import { usersSelectors } from "@reducers/users";
import { loadUsers } from "@reducers/users";
import useSortUsers from "@components/pages/user-pages/useSortUsers";

import UserItem from "@components/pages/user-pages/UserItem";
import HorizontalMenu from "@components/ui/HorizontalMenu";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons"

export default function UsersPage() {
    const jwtToken = useSelector((state) => state.user.value.jwtToken)
    const users = useSelector(usersSelectors.selectAll)
    const [warning, setWarning] = useState({})
    const [searchText, setSearchText] = useState("")
    const [selectedRole, setSelectedRole] = useState("allUsersRoles")

    const dispatch = useDispatch()

    // LOAD USERS FUNCTION AND USEEFFECT
    const fetchUsers = async (clearEtag) => {
        const data = await request({ path: "pros/get-all-users", jwtToken, clearEtag, setWarning })
        if (data) {
            dispatch(loadUsers(data.allUsers))
        }
    } 
   
    useEffect(() => {
        fetchUsers(true)
    }, [])
  
    // Users sorted by roles
    const usersByRoles = useSortUsers(users, searchText)

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

                <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text ? { height: 0 } : { marginTop: phoneDevice ? RPW(3) : 30 }]}>
                    {warning?.text}
                </Text>
            </View>
        )
    }
 
    const usersToDisplay = usersByRoles[selectedRole]?.users ?? [];

    return (
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

                    <FontAwesome name="search" size={appStyle.inputIconSize} color={appStyle.strongBlack}/>
                </View>

                <MaterialDesignIcons name="backspace" size={appStyle.inputIconSize} color={appStyle.strongBlack} onPress={()=>setSearchText("")} />
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
                // initialNumToRender={(props.index && props.index !== "none" && testArticle.length == 0) ? Number(props.index) + 5 : 10}
                // onLayout={() => {
                //     if (props.index && props.index !== "none" && testArticle.length == 0) {
                //         setTimeout(() => {
                //             verticalFlatlistRef.current.scrollToIndex({
                //                 animated: true,
                //                 index: Number(props.index),
                //             })
                //         }, 1500)
                //     }
                // }}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => <UserItem {...item} index={index} />}
                style={{ flex: 1 }}
                contentContainerStyle={{ alignItems: 'center', paddingBottom: appStyle.pagePaddingBottom }}
            />

            

        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent : "space-between",
        height: appStyle.secondHeaderHeight,
        paddingHorizontal: appStyle.secondHeaderHorizPadd,
        paddingTop : phoneDevice ? RPW(1) : 6,
        width: "100%",
    },
    inputContainer : {
        width : phoneDevice ? RPW(68) : 450,
        height : "100%",
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between",
        borderBottomWidth : phoneDevice ? 2 : 3,
        borderBottomColor : appStyle.strongRed,
    }
})