import { StyleSheet, Text, View } from 'react-native';
import GoingBackHeader from 'components/ui/GoingBackHeader';

import { RPH, RPW } from 'utils/dimensions'
import { appStyle } from 'styles/appStyle';

export default function Tab2Page() {
  return (
    <>
      <GoingBackHeader previousPage="/tab1" previousPageName="Tab 1" />
      <View style={styles.body}>
        <Text style={styles.pageTitle}>Tab 2 !</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    ...appStyle.pageBody,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    ...appStyle.pageTitle,
  },
});
