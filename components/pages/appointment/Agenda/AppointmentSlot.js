import { Text, View, StyleSheet } from 'react-native';
import { memo } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';



export default memo(function AppointmentSlot({ start, employees }) {

    return (
        <View style={styles.mainContainer} >
            <Text style={styles.hourText}>
                {start.toFormat("HH:mm")}
            </Text>
        </View>
    )

})

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: appStyle.brightGrey,
        padding: phoneDevice ? RPW(2) : 15,
        borderRadius: appStyle.regularItemBorderRadius,
        marginTop: phoneDevice ? RPW(2) : 15,
    },
    hourText: {
        ...appStyle.regularText,
        textAlign: "center",
    }
})