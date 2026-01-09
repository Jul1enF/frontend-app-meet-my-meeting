import { View } from "react-native";
import { useState } from "react";

import { appStyle } from '@styles/appStyle';

import WeekDatePicker from "../week-date-picker/WeekDatePicker";
import EmployeeSelection from "./EmployeeSelection";


export default function StickyHeader({stickyComponent, selectedDate, setSelectedDate, employees, selectedEmployee, setSelectedEmployee, _id, firstWeekDay, setFirstWeekDay, isSticky = false}) {

    return (
        <View style={ isSticky ? 
            { width: "100%", position: "absolute", top: 0, zIndex: 1, opacity: stickyComponent ? 1 : 0, pointerEvents: stickyComponent ? "auto" : "none", backgroundColor: appStyle.pageBody.backgroundColor }
            : { width: "100%", opacity: stickyComponent ? 0 : 1, pointerEvents: stickyComponent ? "none" : "auto" } }
         >
            <WeekDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} firstWeekDay={firstWeekDay} setFirstWeekDay={setFirstWeekDay} />

            <EmployeeSelection employees={employees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} _id={_id} />
        </View>
    )
}