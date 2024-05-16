import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('Error setting the value', error);
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(value);
    return value;
  } catch (error) {
    console.log('error retriving the value', error);
  }
};
