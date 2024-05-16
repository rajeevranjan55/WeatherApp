import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../Screens/HomeScreen';
const stack = createNativeStackNavigator();
const Routes = () => {
  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{headerShown: false}}>
        <stack.Screen name="HomeScreen" component={HomeScreen} />
      </stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
