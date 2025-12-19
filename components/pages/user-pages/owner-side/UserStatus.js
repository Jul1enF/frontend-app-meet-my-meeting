import { View, StyleSheet, Text } from "react-native";
import { useState, useLayoutEffect} from "react";

import GoingBackHeader from "@components/ui/GoingBackHeader";
import Autocomplete from "@components/ui/Autocomplete";
import UserSchedule from "../schedule/UserSchedule";
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import { userDefaultSchedule } from "constants/userDefaultSchedule";

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
    
    const oldSchedule = user.working_hours ?? userDefaultSchedule;
    const [newSchedule, setNewSchedule] = useState(oldSchedule)
    const scheduleArray = Object.values(newSchedule)


    return (
        <>
            <View style={appStyle.pageBody}>

                <Text style={appStyle.pageTitle}>
                    Utilisateur
                </Text>

                <View style={[appStyle.card, {width : appStyle.largeItemWidth, paddingBottom : phoneDevice ? RPW(12) : 80}]}>

                    <Text style={[appStyle.pageSubtitle, {color : appStyle.fontColorDarkBg, fontSize : appStyle.pageSubtitle.fontSize * 1.05 }]}>
                        Informations :
                    </Text>

                    <View style={[styles.row, { marginTop : appStyle.regularItem.marginTop * 2 }]}>

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


                    <View style={[styles.row, {marginBottom : 0}]}>

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

                    <Text style={[appStyle.pageSubtitle, {color : appStyle.fontColorDarkBg, marginTop : appStyle.largeMarginTop}]}>
                        Statut :
                    </Text>

                    <Autocomplete data={rolesData} setSelectedItem={setNewRole} placeholderText={"Statut de l'utilisateur"} width={"100%"} initialValue={newRole} />

                    {(newRole?.role && newRole?.role !== "client") && <UserSchedule scheduleArray={scheduleArray} setNewSchedule={setNewSchedule} newSchedule={newSchedule} />  }

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
        rowGap: phoneDevice ? RPW(6) : 45,
        marginBottom: phoneDevice ? RPW(6) : 45,
    },
    col: {
        alignItems: "flex-start",
        minWidth: "50%",
        maxWidth: "100%",
        rowGap: phoneDevice ? RPW(3) : 15,
        paddingRight : phoneDevice ? RPW(1) : 8,
    },
    label: {
        ...appStyle.largeText,
        fontWeight: "700",
        color: appStyle.fontColorDarkBg,
        paddingBottom : phoneDevice ? RPW(1) : 6,
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