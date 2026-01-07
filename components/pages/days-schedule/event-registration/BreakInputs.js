import { Text, View, TextInput } from 'react-native';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import TimePicker from '@components/pages/user-pages/user-schedule/TimePicker';
import Autocomplete from '@components/ui/Autocomplete';
import useAutocompleteLists from './useAutocompleteLists';


export default function BreakInputs({ breakDuration, setBreakDuration, eventStart, setEventStart, appointmentsSlots }) {

    // Creation with a hook of the autocomplete list
    const { appointmentsSlotsList } = useAutocompleteLists(null, null, appointmentsSlots, eventStart)


     // Memoisation of the Autocomplete for the appointments slots and the users
    
        const slotsAutocomplete = useMemo(() => (
            <Autocomplete
                key={appointmentsSlotsList.length}
                data={appointmentsSlotsList}
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
        ), [appointmentsSlotsList, eventStart ])

    return (
        <>
            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, }} >
                Durée :
            </Text>
        </>
    )
}