import { useMemo, memo, useRef, useEffect, useState } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import Autocomplete from '@components/ui/autocomplete/Autocomplete';

export default memo(function EmployeeSelection({ employees, selectedEmployee, setSelectedEmployee, isInRedactionComponent = false }) {

    const employeesAutocompleteList = useMemo(() => {
        if (!employees) return null
        else return employees.reduce((acc, e) => {
            acc.push({
                title: `${e.first_name ? (e.first_name + " ") : ""}${e.last_name ?? ""}`,
                employee: e,
            })
            return acc
        }, [])

    }, [employees])

    const inputStyle = {...appStyle.input.baseLarge, ...appStyle.largeText, fontWeight : "600", textAlign : "left" }

    if (isInRedactionComponent){
        inputStyle.color = appStyle.fontColorDarkBg
    }else{
        inputStyle.width = appStyle.largeItemWidth * 0.85
        inputStyle.marginTop = 0
        inputStyle.borderColor = appStyle.strongBlack
    }

    return (
        <>
            {employeesAutocompleteList &&
                <Autocomplete
                    data={employeesAutocompleteList}
                    showClear={false}
                    editable={false}
                    setSelectedItem={setSelectedEmployee}
                    selectedItem={selectedEmployee}
                    sectionToSelectKey={"employee"}
                    inputStyle={inputStyle}
                    placeholderColor={appStyle.mediumGrey}
                    iconColor={isInRedactionComponent ? null : appStyle.strongBlack}
                    multiline={isInRedactionComponent ? true : false}
                />}
        </>
    )
})
