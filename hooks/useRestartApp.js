import { Platform, Dimensions, AppState } from "react-native";
import { useEffect } from "react";
import RNRestart from "react-native-restart-newarch";
import { phoneDevice, RPW } from "@utils/dimensions";
import { useSafeAreaFrame } from "react-native-safe-area-context";


export default function useRestartApp() {

    // FONT ZOOM RESTART LOGIC

    // Register the fontScale when app start
    let lastFontScale = Dimensions.get("window").fontScale;

    // useEffect with a listener for android of focus state to see if the fontScale changed
    useEffect(() => {
        const subscription = Platform.OS !== "android" ? null : AppState.addEventListener("focus", () => {

            const { fontScale } = Dimensions.get("window");

            // console.log("lastFontScale :", lastFontScale, "fontScale :", fontScale)

            if (fontScale !== lastFontScale) {
                RNRestart.restart()
                return;
            }
        })

        return () => {
            subscription && subscription.remove()
        }
    }, [])




    // LAYOUT ZOOM RESTART LOGIC

    const { width: safeWidth } = useSafeAreaFrame()

    // Function to check if on android the current screen width is not the same as the one registered with RPW() and Dimensions (because of an accessibility zoom) and restart completely the app
    const checkScreenWidthChange = () => {

        if (Platform.OS !== "android") return

        // Current size of the screen from Dimension and SafeArea
        const dimWidth = Math.round(RPW(100));
        const layoutWidth = Math.round(safeWidth);

        // console.log("dimWidth :", dimWidth, "layoutWidth :", layoutWidth)

        if (dimWidth !== layoutWidth) {
            RNRestart.restart()
            return;
        }
    }

    // useEffect to check inconsistance between Dimension and SafeArea 
    useEffect(() => {
        checkScreenWidthChange()
    }, [safeWidth])

}