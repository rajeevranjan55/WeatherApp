import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {debounce} from 'lodash';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';
import {getData, setData} from '../utils/asyncStoragr';

const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState('true');
  const [locations, setLocations] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setloading] = useState(false);
  // const [sunrise, setSunrise] = useState('6:00 AM');

  useEffect(() => {
    fetchMyWeatherData();
    setloading(true);
  }, []);
  console.log(forecast?.forecast?.forecastday[0]?.astro?.sunrise);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'India';
    if (myCity) {
      cityName = myCity;
    }
    fetchWeatherForecast({
      cityName,
      days: '7',
    }).then(data => {
      setForecast(data);
      setloading(false);
    });
  };

  const handlelocation = loc => {
    setLocations([]);
    toggleSearch(false);
    setloading(true);
    // console.log('name', loc.name);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7',
    }).then(data => {
      // console.log('got forecast', data);
      setForecast(data);
      setloading(false);
      setData('city', loc.name);
    });
  };

  const handleSearch = value => {
    if (value.length > 2) {
      fetchLocations({cityName: value}).then(data => {
        // console.log('got locations:', data);
        setLocations(data);
      });
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1000), []);
  const {current, location} = forecast;

  console.log(Date);
  return (
    <View style={styles.container}>
      <ImageBackground
        blurRadius={40}
        style={styles.imageBackground}
        resizeMode="cover"
        source={require('../assets/Images/bg.png')}>
        {loading ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ) : (
          <SafeAreaView style={styles.mainView}>
            {/* searchBar */}
            <TouchableOpacity onPress={() => toggleSearch(!showSearch)}>
              <View style={styles.SearchContainer}>
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search"
                  style={{marginLeft: 10, fontSize: 18}}
                />

                <Image
                  style={styles.searchImg}
                  source={require('../assets/Images/Search.png')}
                />
              </View>
            </TouchableOpacity>
            {locations.length > 0 && showSearch ? (
              <View style={styles.location}>
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handlelocation(loc)}
                      style={showBorder ? styles.locText : null}>
                      <View style={styles.locView}>
                        <Image
                          style={styles.locImg}
                          source={require('../assets/Images/locations.png')}
                        />
                        <Text key={index} style={{fontSize: 20}}>
                          {loc?.name} ,{loc?.country}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
            {/* forecast */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 30}}>
                {location?.name},
                <Text style={{fontSize: 15, fontWeight: 500}}>
                  {location?.country}
                </Text>
              </Text>
              <Image
                style={{height: 180, width: 180, marginVertical: 90}}
                source={{uri: 'https:' + current?.condition?.icon}}
              />
              <Text style={{fontSize: 28, fontWeight: 'bold'}}>
                {current?.temp_c}&#176;
              </Text>
              <Text>{current?.condition?.text}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 50,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Images/wind.png')}
                  style={{height: 30, width: 30}}
                />
                <Text style={{marginTop: 5, marginLeft: 5}}>
                  {current?.wind_kph}km
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Images/drop.png')}
                  style={{height: 30, width: 30}}
                />
                <Text style={{marginTop: 5, marginLeft: 5}}>
                  {current?.humidity}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Images/sun.png')}
                  style={{height: 30, width: 30}}
                />
                <Text style={{marginTop: 5, marginLeft: 5}}>
                  {forecast?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
            {/* forecastfor next day */}
            <View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Images/calender.png')}
                  style={{height: 19, width: 19, marginRight: 5}}
                />
                <Text>Daily forecast</Text>
              </View>
              <ScrollView
                style={{marginTop: 20}}
                horizontal
                contentContainerStyle={{}}
                showsHorizontalScrollIndicator={false}>
                {forecast?.forecast?.forecastday?.map((item, index) => {
                  let date = new Date(item.date);
                  let options = {weekday: 'long'};
                  let dayName = date.toLocaleDateString('en-US', options);
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.05)',
                        alignItems: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        justifyContent: 'space-between',
                        marginRight: 7,
                      }}>
                      <Image
                        source={{uri: 'https:' + item?.day?.condition?.icon}}
                        style={{height: 30, width: 30}}
                      />
                      <Text>{dayName}</Text>
                      <Text style={{fontWeight: 'bold'}}>
                        {item?.day?.avgtemp_c}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </SafeAreaView>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  SearchContainer: {
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainView: {
    marginHorizontal: 5,
    marginVertical: 3,
  },
  searchImg: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 8,
    tintColor: 'rgba(52, 52, 52, 0.5)',
  },
  location: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 2,
    position: 'absolute',
    width: '100%',
    marginTop: 70,
    zIndex: 1,
  },
  locText: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  locImg: {
    tintColor: 'grey',
    marginTop: 4,
    marginRight: 8,
    height: 20,
    width: 20,
  },
  locView: {
    flexDirection: 'row',
    marginVertical: 8,
    marginLeft: 5,
  },
});

export default HomeScreen;
