import { StyleSheet, Text, View } from 'react-native';
import {RPH, RPW} from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';


export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={appStyle.pageTitle}>{RPW(1).toFixed(2).toString()}Welcome !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...appStyle.pageBody,
    justifyContent: 'center',
  },
});
