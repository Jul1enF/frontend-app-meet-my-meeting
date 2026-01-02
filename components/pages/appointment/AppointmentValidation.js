import { Text, View, StyleSheet } from 'react-native';
import { useState } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import { useSelector } from 'react-redux';

import StepTitle from './StepTitle';
import Button from '@components/ui/Button';
import Signin from '@components/pages/login/Signin';
import Signup from '@components/pages/login/Signup';


export default function AppointmentValidation() {

    const jwtToken = useSelector((state) => state.user.value.jwtToken)
    const [userIsConnecting, setUserConnecting] = useState(false)
    const [signForm, setSignForm] = useState("signin")

    return (
        <View style={{ paddingBottom: appStyle.mediumMarginTop, width : "100%", alignItems : "center", }} >
            <StepTitle title="3. Valider votre RDV" noChevron={true} marginTop={appStyle.regularMarginTop * 1.5} />
        </View>
    )
    // return (
    //     <View style={{position : "absolute", top : 0, backgroundColor : appStyle.pageBody.backgroundColor, height : "100%", width : "100%"}} >
    //         <Signup />
    //     </View>
    // )
}