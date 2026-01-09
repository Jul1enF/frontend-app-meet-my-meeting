import { Text, View, StyleSheet } from 'react-native';
import { useMemo, memo, useRef, useEffect, useState } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import Autocomplete from '@components/ui/Autocomplete';

export default memo(function EmployeeSelection({ employees, selectedEmployee, setSelectedEmployee, _id }) {

    const employeesAutocompleteList = useMemo(() => {
        if (!employees) return null
        else return employees.reduce((acc, e) => {
            acc.push({
                title: e.first_name,
                id: e._id === _id ? "default" : e._id,
                employee: e,
            })
            return acc
        }, [])

    }, [employees])



    // Ref and useEffect to change the selected employee if it has been elsewhere
    const autocompleteRef = useRef(null)
    const [autocompleteItem, setAutocompleteItem] = useState(null)

    useEffect(() => {
        if (selectedEmployee?._id
            && autocompleteItem?.employee?._id
            && selectedEmployee._id !== autocompleteItem.employee._id) {

            autocompleteRef.current.setItem(employeesAutocompleteList.find(e =>
                e.employee._id === selectedEmployee._id
            ))

        }
    }, [selectedEmployee])



    // Function for the autocomplete to update the selectedEmployees
    const updateSelectedEmployees = (item) => {
        item?.employee && setSelectedEmployee(item.employee)
        setAutocompleteItem(item)
    }


    return (
        <View style={styles.mainContainer}>

            {employeesAutocompleteList &&
                <Autocomplete
                    data={employeesAutocompleteList}
                    showClear={false}
                    editable={false}
                    setSelectedItem={updateSelectedEmployees}
                    initialValue={"default"}
                    inputStyle={{ fontWeight: "600", color: appStyle.strongBlack, fontSize: appStyle.largeText.fontSize }}
                    inputContainerStyle={{ borderColor: appStyle.strongBlack, marginTop: 0 }}
                    placeholderColor={appStyle.mediumGrey}
                    iconColor={appStyle.strongBlack}
                    height={phoneDevice ? null : 70}
                    ref={autocompleteRef}
                />}

        </View>
    )
})

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appStyle.pageBody.backgroundColor,
        paddingVertical: appStyle.regularMarginTop * 0.5,
    }
})