import { View, StyleSheet, Text } from "react-native";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import { toParisDt } from "@utils/timeFunctions";


export default function AppointmentItem({start, employee, appointment_type, employees }) {

    const { category, title, price, default_duration } = appointment_type

    const getEmployeeName = (employee) => {
        const employeeFound = employees.find(e => e._id.toString() === employee.toString())
        if (!employeeFound) return "Employé absent"
        const { first_name, last_name } = employeeFound
        return `${first_name ? (first_name + " ") : ""}${last_name ?? ""}`
    }
    
    return (
        <View style={styles.mainContainer} >

            <View style={styles.row} >
                <Text style={styles.details}>
                    
                    <Text style={styles.label}>
                        Date :
                    </Text>
                    {" "}
                    {toParisDt(start).toFormat("dd/MM/yy")}
                </Text>

                <Text style={styles.details}>

                    <Text style={styles.label}>
                        Heure :
                    </Text>
                    {" "}
                    {toParisDt(start).toFormat("HH:mm")}
                </Text>


                <Text style={styles.details}>

                    <Text style={styles.label}>
                        RDV :
                    </Text>

                    { `  ${!category ? "" : category + "  -  "}${title}  -  ${price} € • ${default_duration} min` }
                </Text>


                <Text style={styles.details}>

                    <Text style={styles.label}>
                        Avec :
                    </Text>
                    {" "}
                    {getEmployeeName(employee)}
                </Text>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        borderWidth: phoneDevice ? 3 : 4,
        borderColor: appStyle.strongRed,
        borderRadius: appStyle.regularItemBorderRadius,
        width: phoneDevice ? RPW(90) : 600,
        paddingHorizontal: appStyle.regularItem.paddingHorizontal,
        paddingBottom: phoneDevice ? RPW(3) : 15,
        paddingTop: phoneDevice ? RPW(4) : 25,
        marginBottom: phoneDevice ? RPW(4) : 20,
    },
    row: {
        flexDirection: "row",
        rowGap: phoneDevice ? RPW(1.5) : 10,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        flexWrap: "wrap",
    },
    label: {
        ...appStyle.labelText,
        fontWeight: phoneDevice ? "900" : "700",
        marginRight: phoneDevice ? RPW(2) : 10,
        textAlign : "left",
    },
    details: {
        ...appStyle.largeText,
        fontWeight: "500",
        color: appStyle.strongBlack,
        textAlign : "left",
        minWidth : "50%"
    }
})