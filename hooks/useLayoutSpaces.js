import { Platform } from "react-native";
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationState } from "@react-navigation/native";
import Constants from 'expo-constants';
import { appStyle } from "@/styles/appStyle"

export default function useLayoutSpaces({ tabBar, secondHeader = false, header = true } = {}) {   
    const tabBarDetected = useNavigationState((state) => {
        if (!state) return false;

        function findTab(navState) {
            if (!navState) return false;
            if (navState.type === "tab") return true;

            const route = navState.routes?.[navState.index];
            return route?.state ? findTab(route.state) : false;
        }

        return findTab(state);
    });

    const tabBarDisplayed = tabBar ?? tabBarDetected



    const { height: screenHeight, width: screenWidth } = useSafeAreaFrame()

    const insets = useSafeAreaInsets();

    const tabbarPaddingBottom = Platform.OS === "ios" ? insets.bottom / 2 : insets.bottom



    const statusBarOffset = Platform.OS === "ios" ? Constants.statusBarHeight : insets.top

    const fullHeaderHeight = header ? (appStyle.headerHeight + statusBarOffset) : 0

    const topBlockedHeight = fullHeaderHeight + (secondHeader ? appStyle.secondHeaderHeight : 0)

    const env = Constants.executionEnvironment
    const isBuild = env === "bare" || env === "standalone"

    // On expo go Android, for modals (react-native-modal), top : 0 already include the statusBarOffset
    const modalOffsetTop = Platform.OS === "ios" || isBuild ? topBlockedHeight : topBlockedHeight - statusBarOffset

    // Height of the tabbar with the inset padding
    const fullTabBarHeight = tabBarDisplayed ? appStyle.tabBarHeight + tabbarPaddingBottom : 0

    const freeHeight = screenHeight - topBlockedHeight - fullTabBarHeight

    return { freeHeight, screenHeight, screenWidth, modalOffsetTop, statusBarOffset, topBlockedHeight, fullTabBarHeight, fullHeaderHeight }
}