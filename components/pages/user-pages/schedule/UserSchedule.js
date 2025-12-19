import { View, Text } from "react-native";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import DaySchedule from "./DaySchedule";

export default function UserSchedule({ scheduleArray, scheduleActions }) {

    const workingHours = scheduleArray.map((e, i)=> <DaySchedule index={i} key={i} scheduleActions={scheduleActions} day={e} /> )

    return (
     <View style={{width : "100%", marginTop : appStyle.largeMarginTop }}>
        <Text style={[appStyle.pageSubtitle, {color : appStyle.fontColorDarkBg}]}>
            Horaires de travail :
        </Text>
        {workingHours}
     </View>
    )
}