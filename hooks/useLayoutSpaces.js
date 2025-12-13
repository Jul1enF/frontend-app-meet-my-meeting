import { Platform } from "react-native";
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from 'expo-constants';
import { appStyle } from "@styles/appStyle"

export default function useLayoutSpaces(tabBar, secondHeader) {
    const { height: screenHeight, width: screenWidth } = useSafeAreaFrame()

    const tabbarPaddingBottom = Platform.OS === "ios" ? useSafeAreaInsets().bottom / 2 : useSafeAreaInsets().bottom

    const statusBarOffset = Platform.OS === "ios" ? Constants.statusBarHeight : useSafeAreaInsets().top

    const topBlockedHeight = secondHeader ? appStyle.headerHeight + appStyle.secondHeaderHeight : appStyle.headerHeight

    // On Android, react native modal already include the statusBarOffset
    const modalOffsetTop = Platform.OS === "ios" ? topBlockedHeight + statusBarOffset : topBlockedHeight

    const freeHeight = screenHeight - appStyle.headerHeight - statusBarOffset 
    - ( tabBar ? appStyle.tabBarHeight + tabbarPaddingBottom : 0)

    return { modalOffsetTop, statusBarOffset, topBlockedHeight, freeHeight, screenHeight, screenWidth }
}