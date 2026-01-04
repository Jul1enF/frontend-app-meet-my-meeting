import { Platform } from "react-native";
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from 'expo-constants';
import { appStyle } from "@styles/appStyle"

export default function useLayoutSpaces(tabBar, secondHeader) {
    const { height: screenHeight, width: screenWidth } = useSafeAreaFrame()

    const insets = useSafeAreaInsets();

    const tabbarPaddingBottom = Platform.OS === "ios" ? insets.bottom / 2 : insets.bottom

    const statusBarOffset = Platform.OS === "ios" ? Constants.statusBarHeight : insets.top

    const topBlockedHeight = secondHeader ? appStyle.headerHeight + appStyle.secondHeaderHeight : appStyle.headerHeight

    const env = Constants.executionEnvironment
    const isBuild = env === "bare" || env === "standalone" ? true  : false

    // On expo go Android, top : 0 already include the statusBarOffset
    const modalOffsetTop = Platform.OS === "ios" || isBuild ? topBlockedHeight + statusBarOffset : topBlockedHeight

    const freeHeight = screenHeight - topBlockedHeight - statusBarOffset 
    - ( tabBar ? appStyle.tabBarHeight + tabbarPaddingBottom : 0)

    return { modalOffsetTop, statusBarOffset, topBlockedHeight, freeHeight, screenHeight, screenWidth }
}