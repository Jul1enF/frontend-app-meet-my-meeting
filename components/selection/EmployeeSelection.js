import { useMemo, memo, useRef, useEffect, useState } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import Autocomplete from '@components/ui/Autocomplete';

export default memo(function EmployeeSelection({ employees, selectedEmployee, setSelectedEmployee, _id, isInRedactionComponent = false }) {

    const employeesAutocompleteList = useMemo(() => {
        if (!employees) return null
        else return employees.reduce((acc, e) => {
            acc.push({
                title: `${e.first_name ? (e.first_name + " ") : ""}${e.last_name ?? ""}`,
                id: e._id === _id ? "default" : e._id,
                employee: e,
            })
            return acc
        }, [])

    }, [employees])



    // Ref for the autocomplete
    const autocompleteRef = useRef(null)
    // state to register THIS autocomplete value to compare it to selectedEmployee
    const [autocompleteItem, setAutocompleteItem] = useState(null)

    // useEffect to change the selected employee if it has been changed elsewhere (on the other version of the sticky header or in an event update)
    useEffect(() => {
        if (
            selectedEmployee?._id
            && selectedEmployee._id.toString() !== autocompleteItem?.employee?._id?.toString()
            && autocompleteRef.current
        ) {
            const employeeFound = employeesAutocompleteList?.find(e =>
                e.employee._id.toString() === selectedEmployee._id.toString()
            )

            // If the employee is no longer in the team
            if (!employeeFound) {
                const suppressedEmployee = {
                    title: "Ce professionnel ne fait plus partie de l'équipe !",
                    id: "suppressedEmployee",
                }

                autocompleteRef.current.setItem(suppressedEmployee)

                setSelectedEmployee(null)
            }
            else {
                autocompleteRef.current.setItem(employeeFound)
            }

        }
    }, [selectedEmployee])



    // Function for the autocomplete to update the selectedEmployees
    const updateSelectedEmployees = (item) => {
        item?.employee && setSelectedEmployee(item.employee)
        setAutocompleteItem(item)
    }


    return (
        <>
            {employeesAutocompleteList &&
                <Autocomplete
                    data={employeesAutocompleteList}
                    showClear={false}
                    editable={false}
                    setSelectedItem={updateSelectedEmployees}
                    initialValue={"default"}
                    width={isInRedactionComponent ? "100%" : appStyle.largeItemWidth * 0.85}
                    inputStyle={{
                        fontWeight: "600",
                        color: isInRedactionComponent ? appStyle.fontColorDarkBg : appStyle.strongBlack,
                        fontSize: appStyle.largeText.fontSize,
                        ...(isInRedactionComponent && { height: "auto", paddingTop: phoneDevice ? RPW(2.5) : 22, paddingBottom: phoneDevice ? RPW(2.5) : 22, minHeight: appStyle.largeItemHeight })
                    }}
                    inputContainerStyle={{
                        borderColor: isInRedactionComponent ? appStyle.lightGrey : appStyle.strongBlack,
                        ...(!isInRedactionComponent && { marginTop: 0 }),
                        ...(isInRedactionComponent && { height: "auto" })
                    }}
                    placeholderColor={appStyle.mediumGrey}
                    iconColor={isInRedactionComponent ? null : appStyle.strongBlack}
                    height={isInRedactionComponent ? null : (phoneDevice ? null : 70)}
                    ref={autocompleteRef}
                    multiline={isInRedactionComponent ? true : false}
                />}
        </>
    )
})
