import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";

import { ButtonTouchable } from "@/components/ButtonTouchable";
import { Hour } from "@/components/Hour";

import { LinearGradient } from "expo-linear-gradient";

import { initializeDB, saveDataDB, getDataDB } from "@/services/database";

import { saveFile, readFile } from "@/services/filesystem";

import {
  requestNotificationPermission,
  sendNotificiation,
} from "@/services/notifications";

import { getForecast } from "@/services/OpenMeteo";

import { generatePDF } from "@/services/reports";
import { TopTemperature } from "@/components/TopTemperature";
import { InfoViewTop } from "@/components/InfoViewTop";

export default function Index() {
  const [temperature, setTemperature] = useState("0");
  const [humidity, setHumidity] = useState("0");
  const [rain, setRain] = useState("0");
  const [timestamp, setTimestamp] = useState("0");
  const [window, setWindow] = useState("open");
  const [isRefresh, setIsRefresh] = useState(false);

  const fetchWindow = async () => {
    try {
      const windowResponse = await fetch(
        "https://automate-house-production.up.railway.app/window/state"
      );
      const windowJson = await windowResponse.json();

      if (windowJson.state != window) {
        if (windowJson.state === "open") {
          sendNotificiation(
            "Janela",
            "Por causa da chuva, as janelas foram fechadas."
          );
        } else {
          sendNotificiation("Janela", "As janelas foram abertas.");
        }

        setWindow(windowJson.state);
        saveFile(windowJson.state, "window.txt");
      }
    } catch (error: any) {
      console.log("Error ", error.message);
    }
  };

  const fetchData = async () => {
    try {
      const sensorResponse = await fetch(
        "https://automate-house-production.up.railway.app/sensor/last"
      );
      const sensorJson = await sensorResponse.json();

      const newData = {
        temperature: sensorJson.temperature,
        humidity: sensorJson.humidity,
        timestamp: sensorJson.timestamp,
      };

      const hasChanges = 
        newData.temperature !== temperature ||
        newData.humidity !== humidity ||
        newData.timestamp !== timestamp;

      if (hasChanges) {
        setTemperature(newData.temperature);
        setHumidity(newData.humidity);
        setTimestamp(newData.timestamp);

        await saveFile(newData.temperature, "temperature.txt");
        await saveFile(newData.humidity, "humidity.txt");
      }

      await fetchWindow();

      const date = new Date();
      const forecast = await getForecast();
      const precipitationProbability = String(
        forecast.hourly.precipitationProbability[date.getHours()]
      );

      const rainChanged = precipitationProbability !== rain;
      if (rainChanged) {
        setRain(precipitationProbability);
        await saveFile(precipitationProbability, "rain.txt");
      }

      if (hasChanges) {
        await saveDataDB(
          newData.temperature,
          newData.humidity,
          precipitationProbability,
          newData.timestamp
        );
      }

    } catch (error: any) {
      console.log("Error ", error.message);
    } finally {
      setIsRefresh(false);
    }
  };

  const changeWindow = async () => {
    const windowNow = window === "open" ? "closed" : "open";
    const windowJSON = JSON.stringify({ state: windowNow });

    try {
      const windowResponse = await fetch(
        "https://automate-house-production.up.railway.app/window/control",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: windowJSON,
        }
      );

      setWindow(windowNow);
    } catch (error: any) {
      console.log("Error: " + error.message);
    }
  };

  const pullToRefresh = () => {
    setIsRefresh(true);
    fetchData();
  };

  useEffect(() => {
    const loadData = async () => {
      initializeDB();

      requestNotificationPermission();

      setTemperature("20");
      setHumidity(await readFile("humidity.txt"));
      setRain(await readFile("rain.txt"));
      setWindow(await readFile("window.txt"));
    };

    loadData();

    const interval = setInterval(fetchWindow, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={pullToRefresh} />
        }
      >
        <LinearGradient
          colors={["#FFFFFF", "#999999"]}
          style={styles.background}
        />

        <TopTemperature temperature={temperature} />

        <Hour />

        <InfoViewTop
          humidity={humidity}
          rain={rain}
          stylesView={{ margin: 20 }}
        />

        <View style={styles.inline}>
          <ButtonTouchable
            onClick={async () => {
              const data = await getDataDB();
              generatePDF(data);
            }}
            icon="pdf"
          />

          <ButtonTouchable
            onClick={() => {
              saveFile(window === "open" ? "close" : "open", "window.txt");
              changeWindow();
            }}
            icon="window"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: "150%",
    zIndex: -1,
  },
  inline: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 40,
  },
  image: {
    width: 122,
    height: 122,
    marginTop: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    width: "100%",
    height: "100%",
  },
});
