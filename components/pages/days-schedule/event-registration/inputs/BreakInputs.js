import { Text, View, TextInput } from 'react-native';
import { useMemo, useState, useEffect } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import DurationPicker from './DurationPicker';
import Autocomplete from '@components/ui/Autocomplete';
import useAutocompleteLists from '../event-update/useAutocompleteLists';


export default function BreakInputs({ breakDuration, setBreakDuration, eventStart, setEventStart, appointmentsSlots, description, setDescription }) {

    // Creation with a hook of the autocomplete list
    const { appointmentsSlotsList } = useAutocompleteLists(null, null, appointmentsSlots, eventStart)


    const [slotWarning, setSlotWarning] = useState("")

    // Set an error if the break start selected doesn't fit with the break duration in a schedule slot
    useEffect(() => {

        if (!breakDuration || !appointmentsSlotsList) return
        if (!appointmentsSlotsList.some(e =>
            e.start.toMillis() === eventStart.toMillis()
        )) {
            setSlotWarning("Erreur : la pause ne rentre pas dans le créneau ! Merci de changer sa durée ou de choisir un autre horaire ci dessous :")
            setTimeout(() => setSlotWarning(""), 6000)
        }
    }, [breakDuration, appointmentsSlotsList])


    // Memoisation of the Autocomplete for the appointments slots and the users

    const slotsAutocomplete = useMemo(() => (
        <Autocomplete
            key={appointmentsSlotsList ? appointmentsSlotsList.length : "key"}
            data={appointmentsSlotsList ?? []}
            placeholderText={eventStart ? eventStart.toFormat("HH : mm") : "Horaire"}
            initialValue={"initialValue"}
            showClear={false}
            editable={false}
            setSelectedItem={(item) => item?.start && setEventStart(item?.start)}
            emptyText={!breakDuration ? "Merci de sélectionner une durée" : "Aucun créneau disponible"}
            width="100%"
            suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40, fontWeight: "700" }}
            listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
        />
    ), [appointmentsSlotsList, eventStart])

    return (
        <>
            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop }} >
                Durée :
            </Text>

            <View style={{ width: "100%", alignItems: "center", marginTop: appStyle.regularMarginTop }}>
                <DurationPicker duration={breakDuration} changeDuration={setBreakDuration} />
            </View>


            <Text style={[appStyle.warning, !slotWarning && { height: 0, marginTop: 0 }]}>
                {slotWarning}
            </Text>


            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.largeMarginTop }} >
                Début :
            </Text>

            {slotsAutocomplete}

            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, }} >
                Description :
            </Text>


            <TextInput
                style={{ ...appStyle.input.baseLarge, width: "100%", fontWeight: "700", color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => setDescription(e)}
                value={description}
                placeholder='Description...'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="sentences"
            />
        </>
    )
}