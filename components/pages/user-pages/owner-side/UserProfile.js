import { View, StyleSheet, Text } from "react-native";
import { useState, useMemo} from "react";

import Autocomplete from "@components/ui/Autocomplete";
import UserInformations from "./UserInformations";
import UserSchedule from "../schedule/UserSchedule";
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import { userDefaultSchedule } from "constants/userDefaultSchedule";
import { createScheduleActions } from "../schedule/scheduleUtils";


export default function UserProfile({ selectedUser: user,}) {

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

    const scheduleActions = useMemo(()=>{
        return createScheduleActions(setNewSchedule)
    },[])


    return (
        <>
            <View style={appStyle.pageBody}>

                <Text style={appStyle.pageTitle}>
                    Utilisateur
                </Text>

                <View style={[appStyle.card, {width : appStyle.largeItemWidth, paddingBottom : phoneDevice ? RPW(12) : 80}]}>

                    <UserInformations user={user} />


                    <Text style={[appStyle.pageSubtitle, {color : appStyle.fontColorDarkBg, marginTop : appStyle.largeMarginTop}]}>
                        Statut :
                    </Text>

                    <Autocomplete data={rolesData} setSelectedItem={setNewRole} placeholderText={"Statut de l'utilisateur"} width={"100%"} initialValue={newRole} />

                    {(newRole?.role && newRole?.role !== "client") && <UserSchedule scheduleArray={scheduleArray} scheduleActions={scheduleActions} />  }

                </View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    
})