import React from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import Routes from './src/Navigations/Routes';

const App = () => {
  return (
    <View style={styles.mainViewStyle}>
      <StatusBar backgroundColor="lightblue" />
      <Routes />
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {flex: 1},
});

export default App;
