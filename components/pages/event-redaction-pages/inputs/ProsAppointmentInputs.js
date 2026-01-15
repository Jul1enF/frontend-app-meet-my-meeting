import { Text, TextInput } from "react-native"
import { useMemo } from "react";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import Autocomplete from "@components/ui/Autocomplete";

export default function ProsAppointmentInputs({ usersList, usersAutocompleteRef, setClient, unregisteredClient, setUnregisteredClient }) {


    // Memoisation of the Autocomplete for the users
    const usersAutocomplete = useMemo(() => (
        <Autocomplete
            data={usersList}
            ref={usersAutocompleteRef}
            placeholderText={"Utilisateur ( inscrit )"}
            setSelectedItem={(item) => setClient(item?.user ?? null)}
            emptyText="Aucun résultat"
            width="100%"
            inputStyle={{ height: "auto", paddingTop: phoneDevice ? RPW(3) : 22, paddingBottom: phoneDevice ? RPW(3) : 22, minHeight: appStyle.largeItemHeight }}
            inputContainerStyle={{ height: "auto" }}
            suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40 }}
            listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
            multiline={true}
        />
    ), [usersList])



    return (
        <>
            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, textAlign: "center" }}>
                Utilisateur inscrit à l'app :
            </Text>

            {usersAutocomplete}



            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, textAlign: "center" }}>
                Utilisateur non enregistré :
            </Text>

            <TextInput
                style={{ ...appStyle.input.baseLargeCard, color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => {
                    setUnregisteredClient(prev => ({ ...prev, last_name: e }))
                }}
                value={unregisteredClient.last_name}
                placeholder='Nom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            />

            <TextInput
                style={{ ...appStyle.input.baseLargeCard, color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => {
                    setUnregisteredClient(prev => ({ ...prev, first_name: e }))
                }}
                value={unregisteredClient.first_name}
                placeholder='Prénom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            />

        </>
    )
}