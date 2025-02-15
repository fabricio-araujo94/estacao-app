import * as Location from "expo-location";
import { fetchWeatherApi } from "openmeteo";

export const getForecast = async () => {
  var forecast = {
    chance: "",
    description: "",
  };

  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permissão de localização negada");
      return;
    }

    let localization = await Location.getCurrentPositionAsync({});

    const params = {
      latitude: localization.coords.latitude,
      longitude: localization.coords.longitude,
      hourly: [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation_probability",
        "rain",
      ],
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
        precipitationProbability: hourly.variables(2)!.valuesArray()!,
        rain: hourly.variables(3)!.valuesArray()!,
      },
    };

    for (let i = 0; i < weatherData.hourly.time.length; i++) {
      console.log(
        weatherData.hourly.time[i].toISOString(),
        weatherData.hourly.temperature2m[i],
        weatherData.hourly.relativeHumidity2m[i],
        weatherData.hourly.precipitationProbability[i],
        weatherData.hourly.rain[i]
      );
    }

    return weatherData;
  } catch (error: any) {
    console.log(`Erro: ${error.message}`);

    return forecast;
  }
};
