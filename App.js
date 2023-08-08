import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator, ImageBackground } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get("window").width;
const API_KEY = '1a2d3e0910911685db6f4a8269c26907'; //무료api

const icons = {
  "Thunderstorm" : "lightning",
  "Drizzle" : "day-rain",
  "Rain" : "rains",
  "Snow" : "snows",
  "Atmosphere" : "fog",
  "Clear" : "day-sunny",
  "Clouds" : "cloudy",
};

const backColor = {
  "Thunderstorm" : ['#6a85b6','#bac8e0'],
  "Drizzle" : ['#bdc2e8','#e6dee9'],
  "Rain" : ['#cfd9df','#e2ebf0'],
  "Snow" : ['#d5d4d0','#d5d4d0'],
  "Atmosphere" : ['#fdfcfb','#e2d1c3'],
  "Clear" : ['#4facfe','#00f2fe'],
  "Clouds" : ['#fdfbfb','#ebedee'],
};

export default function App() {
  
  const [city, setCity] = useState([]);
  const [description, setDescription] = useState([]);
  const [temp, setTemp] = useState([]);
  const [request, setRequest] = useState(true);

  const getLocaAuth = async() => {

    //위치정보 접근 권한 요청
    const granted = await Location.requestForegroundPermissionsAsync(); 
    if (!granted){ 
      setRequest(false); //접근 권한 요청거부 시
    }

    //도시정보
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5}); //좌표(위도와 경도)
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps : false});
    console.log(location);
    setCity(location[0]);

    //날씨정보
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    console.log(json);  
    setDescription(json.weather[0]);
    setTemp(json.main.temp);
  }

  //React Hook
  useEffect(()=> { 
    getLocaAuth();
  },[]);
  
  return (
    <View style={styles.container}>
      {city.length === 0 ? (
        <View style={styles.city}>
          <ActivityIndicator color="white" size="large"/>
        </View>
        ) : (
          <View style={styles.city}>
            <Fontisto name="map-marker-alt" size={30} color="black" />
            <Text style={styles.cityName}>{city.city === null ? city.subregion : city.city}</Text>
            <Text style={styles.street}>{city.street}</Text>
          </View>
      )}
      <ScrollView 
        pagingEnabled 
        horizontal
        showsHorizontalScrollIndicator={false}
        ContentContainerStyle={styles.weather}
      >
        {temp.length === 0 || description.length === 0 ?
          (
            <View style={styles.day}>
              <ActivityIndicator color="white" size="large"/>
            </View>
          ) : (
            <View style={styles.day}>
              <Fontisto name={icons[description.main]} size={49} color="black"/>
              <Text style={styles.temp}>
                {parseFloat(temp).toFixed(1)}°
              </Text>
              <Text style={styles.description}>
                {description.main} {"\n"}
                <Text style={styles.detailDescription}>
                  {description.description}
                </Text>
              </Text>
            </View>
          )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
  },
  city : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  },
  cityName : {
    fontSize : 46,
    lineHeight : 92,
    fontWeight : '500',
  },
  street : {
    fontSize : 27,
  },
  day : {
    width : SCREEN_WIDTH,
    justifyContent : 'top',
    alignItems : 'center',
  },
  temp : {
    fontWeight : '500',
    fontSize : 72,
    textAlign : 'center',
  },
  description : {
    fontSize : 36,
    textAlign : 'center',
  },
  detailDescription : {
    fontSize : 20,
    textAlign : 'center',
  }, 
});
//3-hour Forecast 5 days 로 스와이프 할 수 있게 만들기