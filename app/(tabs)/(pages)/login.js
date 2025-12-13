import { StyleSheet, Text, View } from 'react-native';

import {RPH, RPW} from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <Text>Login !</Text>
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