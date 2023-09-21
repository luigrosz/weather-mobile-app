import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const MINUTE_MS = 10000;

export default function App() {
  const [isLoading, setLoading] = useState(false);
  const [weatherObj, setWeatherObj] = useState();

  async function callApi() {
    try {
      const response = await fetch(
        "https://api.openweathermap.org/data/3.0/onecall?id=524901&lat=-15.8957166&lon=-52.2514538&exclude=hourly,daily,minutely&units=metric&appid=process.env.API_KEY"
      );
      const data = await response.json();
      const { current } = data;
      current.weather[0].icon = current.weather[0].icon.substring(0, 2);
      setWeatherObj(current);
      setLoading(false);
    } catch (error) {
      console.log("error on api call", error);
    }
  }

  useEffect(() => {
    setLoading(true);
    callApi();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      callApi();
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  function test() {
    console.log(weatherObj.weather[0].icon);
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {isLoading ? (
        <Image source={require(`./assets/loading.gif`)}></Image>
      ) : (
        weatherObj && (
          <View>
            {/* {test()} */}
            <Text>Temperatura: {weatherObj.temp}</Text>
            <Image
              source={require(`./assets/ow-icons/${weatherObj.weather[0].icon}d.png`)}
              // source={require(`./assets/ow-icons/04d.png`)}
            ></Image>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
