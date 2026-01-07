import { ScrollView } from "react-native"

import { appStyle } from "@styles/appStyle"

import Modal from "react-native-modal"
import useLayoutSpaces from "@hooks/useLayoutSpaces"
import GoingBackHeader from "@components/ui/GoingBackHeader";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";


export default function ModalPageWrapper({ visible, setVisible, closeFunction, backHeaderText, noScrollView, children }) {

    const { freeHeight, screenHeight, screenWidth } = useLayoutSpaces(true)

    const close = () =>{
        setVisible(false)
        typeof closeFunction === "function" && closeFunction()
    }

    return (
        <Modal
            isVisible={visible}
            style={{ maxHeight: freeHeight, top: 0, width: "100%", alignItems: "flex-start", justifyContent: "flex-start", margin: 0, zIndex : 999 }}
            coverScreen={false}
            backdropColor="transparent"
            animationIn="slideInRight"
            animationOut="slideOutRight"
            onBackButtonPress={close}
            deviceWidth={screenWidth}
            deviceHeight={screenHeight}
            useNativeDriverForBackdrop={true}
        >
            <AutocompleteDropdownContextProvider>

                <GoingBackHeader previousPageName={backHeaderText} leftFunction={close} />

                { noScrollView && {children} }


                { !noScrollView && <ScrollView style={{ minWidth: "100%" }} contentContainerStyle={{ backgroundColor: appStyle.pageBody.backgroundColor, minHeight: freeHeight }} bounces={false} overScrollMode="never" >

                    {children}

                </ScrollView>}

            </AutocompleteDropdownContextProvider>
        </Modal>
    )
}