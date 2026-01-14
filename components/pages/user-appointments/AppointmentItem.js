import { View, StyleSheet, Text } from "react-native";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import { toParisDt } from "@utils/timeFunctions";

import LabelValue from "@components/text/LabelValue";


export default function AppointmentItem({ start, employee, appointment_type, employees }) {

    const { category, title, price, default_duration } = appointment_type

    const getEmployeeName = (employee) => {
        const employeeFound = employees.find(e => e._id.toString() === employee.toString())
        if (!employeeFound) return "Employé absent"
        const { first_name, last_name } = employeeFound
        return `${first_name ? (first_name + " ") : ""}${last_name ?? ""}`
    }


    const informationsArray = [
        {label : "Date :", details : toParisDt(start).toFormat("dd/MM/yy")},
        {label : "Heure :", details : toParisDt(start).toFormat("HH:mm")},
        {label : "RDV :", details : ` ${!category ? "" : category + "  -  "}${title}  -  ${price} €  •  ${default_duration} min`},
        {label : "Avec :", details : getEmployeeName(employee)}

    ]

    return (
        <View style={styles.mainContainer} >

            <View style={styles.row} >
                {
                    informationsArray.map((e,i)=>
                        <LabelValue key={i} {...e} labelStyle={styles.label} detailsStyle={styles.details} index={i} lastIndex={informationsArray.length - 1} />
                    )
                }

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
        justifyContent: "flex-start",
        flexWrap: "wrap",
    },
    label: {
        ...appStyle.labelText,
        fontWeight: phoneDevice ? "900" : "700",
        textAlign: "left",
        lineHeight : "auto"
    },
    details: {
        ...appStyle.largeText,
        fontWeight: "500",
        textAlign: "left",
        lineHeight: phoneDevice ? RPW(8) : 48,
    }
})