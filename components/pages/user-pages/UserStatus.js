import { View, StyleSheet, Text } from "react-native";
import { useState, useLayoutEffect} from "react";

import GoingBackHeader from "@components/ui/GoingBackHeader";
import Autocomplete from "@components/ui/Autocomplete";
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import moment from 'moment/min/moment-with-locales'


export default function UserStatus({ selectedUser: user, setUserModalVisible }) {

    moment.locale('fr')

    const rolesData = [
        {id : "1", title : "Gérant", role : "owner"},
        {id : "2", title : "Administrateur", role : "admin"},
        {id : "3", title : "Employé", role : "employee"},
        {id : "4", title : "Client", role : "client"},
    ]

    const index = rolesData.findIndex(e=>e.role === user.role)
    const [newRole, setNewRole]=useState(rolesData[index])


    return (
        <>
            <GoingBackHeader previousPageName="Liste des utilisateurs" leftFunction={() => setUserModalVisible(false)} />
            <View style={appStyle.pageBody}>

                <Text style={appStyle.pageTitle}>
                    Utilisateur :
                </Text>

                <View style={[appStyle.card, {width : phoneDevice ? RPW(95) : 650}]}>

                    <View style={styles.row}>

                        <View style={styles.col}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Nom :
                                </Text>
                            </View>
                            

                            <Text style={styles.status}>
                                {user?.last_name}
                            </Text>
                        </View>

                         <View style={styles.col}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Prénom :
                                </Text>
                            </View>

                            <Text style={styles.status}>
                                {user?.first_name}
                            </Text>
                        </View>

                    </View>


                    <View style={styles.row}>

                        <View style={styles.col}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Email :
                                </Text>
                            </View>
                            

                            <Text style={styles.status}>
                                {user?.email}
                            </Text>
                        </View>

                         <View style={styles.col}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Date d'inscription :
                                </Text>
                            </View>

                            <Text style={styles.status}>
                                {moment(user?.createdAt).format("DD / MM / YYYY")}
                            </Text>
                        </View>

                    </View>

                    <Autocomplete data={rolesData} setSelectedItem={setNewRole} placeholderText={"Statut de l'utilisateur"} width={appStyle.regularItemWidth} height={appStyle.regularItemHeight} initialValue={newRole} />

                </View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        width: "100%",
        rowGap: phoneDevice ? RPW(3.8) : 26,
        marginBottom: phoneDevice ? RPW(4.8) : 28,
    },
    col: {
        alignItems: "flex-start",
        minWidth: "50%",
        maxWidth: "100%",
        rowGap: phoneDevice ? RPW(2) : 13,
        paddingRight : phoneDevice ? RPW(1) : 8,
    },
    label: {
        ...appStyle.largeText,
        fontWeight: "700",
        color: appStyle.fontColorDarkBg,
        paddingBottom : phoneDevice ? RPW(0.8) : 6,
    },
    labelContainer: {
        borderBottomColor: appStyle.darkWhite,
        borderBottomWidth: phoneDevice ? 2 : 3,
    },
    status: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
    }
})