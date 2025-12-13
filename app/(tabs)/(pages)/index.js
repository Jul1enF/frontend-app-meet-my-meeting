import { StyleSheet, Text, View } from 'react-native';

import {RPH, RPW} from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

export default function Home2Page() {
  return (
    <View style={styles.container}>
      <Text>Home 2 !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...appStyle.pageBody,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
