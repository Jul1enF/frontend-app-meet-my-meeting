import { Tabs } from "expo-router";
import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function TabsLayout() {

  // Offset bottom for the navigations bar (the ios ones are not well calculated)
  const tabbarPaddingBottom = Platform.OS === "ios" ? useSafeAreaInsets().bottom / 2 : useSafeAreaInsets().bottom

  const fullTabBarHeight = appStyle.tabBarHeight + tabbarPaddingBottom



  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown : false,
        keyboardHidesTabBar: true,

        tabBarIcon: ({ focused }) => {
          let iconName = '';
          let color = ""
          color = focused ? appStyle.darkWhite : appStyle.lightGrey

          switch (route.name) {
            case 'date-picker':
              iconName = 'square-outline'
              break;
            case 'tab2':
              iconName = 'triangle-outline'
              break;
          }

          return <MaterialCommunityIcons name={iconName} size={phoneDevice ? RPW(6.5) : 32} color={color} />;
        },

        tabBarIconStyle: { width: "100%", height: appStyle.tabBarHeight / 2 },
        tabBarLabelStyle: { fontSize: phoneDevice ? RPW(4) : 26, fontWeight: "500", height: appStyle.tabBarHeight / 2 },
        tabBarActiveTintColor: appStyle.darkWhite,
        tabBarInactiveTintColor: appStyle.lightGrey,

        tabBarBackground: () => (
          <LinearGradient
            colors={[appStyle.strongRed, appStyle.strongBlack]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ height: 150 }}
          ></LinearGradient>
        ),

        tabBarStyle: { height: fullTabBarHeight, paddingBottom: tabbarPaddingBottom, width: "100%", justifyContent: "space-evenly" },
        tabBarLabelPosition: "below-icon",

      })}
    >
      <Tabs.Screen name="date-picker" options={{
        title: "Date Picker",
      }} />
      <Tabs.Screen name="tab2" options={{
        title: "Tab 2",
      }} />
      <Tabs.Screen name="pages" options={{
        tabBarItemStyle: { display: "none" },
      }} />
    </Tabs>
  )
}