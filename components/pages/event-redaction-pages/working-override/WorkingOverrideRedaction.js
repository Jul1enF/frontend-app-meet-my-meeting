import { Text, View, StyleSheet, Platform } from 'react-native';
import { memo, useState } from 'react';
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import DayScheduleForm from '@components/user-schedule/DayScheduleForm';
import WorkingOverrideSaving from './WorkingOverrideSaving';


export default memo(function WorkingOverrideRedaction({ workingOverrideContext }) {
    const { oldEvent, defaultWorkingSchedule, resetAndRenewEvents } = workingOverrideContext

    const [workingSchedule, setWorkingSchedule] = useState(oldEvent?.working_schedule ?? defaultWorkingSchedule)

    const updateWorkingSchedule = (partialDay) => {
        setWorkingSchedule(prev => ({
            ...prev,
            ...partialDay,
        }));
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}
            contentContainerStyle={[
                appStyle.pageBody,
                { flex: "auto" }
            ]}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            overScrollMode="never"
            bottomOffset={Platform.OS === 'ios' ? 40 : 20}
        >

            <Text style={appStyle.pageTitle}>
                {`${oldEvent?.category === "dayOff" ? "Rajouter" : "Modifier"} une journée de travail :`}
            </Text>

            <View style={appStyle.largeCard}>

                <Text style={[appStyle.pageSubtitle, { color: appStyle.fontColorDarkBg }]}>
                    Horaires de travail :
                </Text>

                <View style={{ width: "100%" }}>
                    <DayScheduleForm
                        onChange={updateWorkingSchedule}
                        day={workingSchedule}
                        showDayToggle={false}
                    />
                </View>


                <WorkingOverrideSaving resetAndRenewEvents={resetAndRenewEvents} oldEvent={oldEvent} workingSchedule={workingSchedule} />

            </View>

        </KeyboardAwareScrollView>
    )
})