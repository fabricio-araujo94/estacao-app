import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";

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
import { Buttons } from "@/components/Buttons";

const { width, height } = Dimensions.get("window")

export default function Index() {
  const [temperature, setTemperature] = useState("0");
  const [humidity, setHumidity] = useState("0");
  const [rain, setRain] = useState("0");
  const [timestamp, setTimestamp] = useState(new Date());
  const [window, setWindow] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  
  const windowRef = useRef(window);
  const previousData = useRef({
    temperature: "0",
    humidity: "0",
    rain: "0",
    timestamp: new Date()
  });

  const fetchWindow = async () => {
    try {
      const windowResponse = await fetch(
        "https://automate-house-production.up.railway.app/window/state"
      );
      
      // Verificar se a resposta é válida
      if (!windowResponse.ok) throw new Error("Falha na requisição da janela");
      
      const windowJson = await windowResponse.json();
      const newState = String(windowJson.state);
  
      // Usar a referência para comparação precisa
      if (newState !== windowRef.current) {
        console.log(`Mudança de estado: ${windowRef.current} → ${newState}`);
  
        // Atualizar tanto o estado quanto a referência
        setWindow(newState);
        windowRef.current = newState;
  
        // Enviar notificação com o novo estado
        sendNotificiation(
          "Janela",
          newState === "open" 
            ? "As janelas foram abertas." 
            : "Por causa da chuva, as janelas foram fechadas."
        );
  
        // Salvar no filesystem
        await saveFile(newState, "window.txt");
      }
    } catch (error: any) {
      console.log("Error ", error.message);
    }
  };

  const fetchData = async () => {
    try {
      const sensorResponse = await fetch("https://automate-house-production.up.railway.app/sensor/last");
      const sensorJson = await sensorResponse.json();
      
      const newData = {
        temperature: sensorJson.temperature,
        humidity: sensorJson.humidity,
        timestamp: new Date(),
        rain: String((await getForecast())!.hourly.precipitationProbability[new Date().getHours()])
      };

      const hasChanges = 
        newData.temperature !== previousData.current.temperature ||
        newData.humidity !== previousData.current.humidity ||
        newData.rain !== previousData.current.rain;

      if (hasChanges) {
        console.log(`Mudança de estado: ${previousData.current.temperature} → ${newData.temperature}`);
        console.log(`Mudança de estado: ${previousData.current.humidity} → ${newData.humidity}`);
        console.log(`Mudança de estado: ${previousData.current.timestamp} → ${newData.timestamp}`);
        console.log(`Mudança de estado: ${previousData.current.rain} → ${newData.rain}`);

        setTemperature(newData.temperature);
        setHumidity(newData.humidity);
        setRain(newData.rain);
        setTimestamp(newData.timestamp);
        
        previousData.current = newData;
        
        await Promise.all([
          saveFile(newData.temperature, "temperature.txt"),
          saveFile(newData.humidity, "humidity.txt"),
          saveFile(newData.rain, "rain.txt"),
          saveDataDB(newData.temperature, newData.humidity, newData.rain, newData.timestamp)
        ]);
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
      saveFile(windowNow, "window.txt");
    } catch (error: any) {
      console.log("Error: " + error.message);
    }
  };

  const createPDF = async () => {
    const data = await getDataDB();
    generatePDF(data);
  };

  const pullToRefresh = () => {
    setIsRefresh(true);
    fetchData();
  };

  useEffect(() => {
    const loadData = async () => {
      initializeDB();

      requestNotificationPermission();

      const actualData = {
        temperature: await readFile("temperature.txt"),
        humidity: await readFile("humidity.txt"),
        timestamp: new Date(),
        rain: await readFile("rain.txt")
      };
      
      previousData.current = actualData
      windowRef.current = await readFile("window.txt")
      
      setTemperature(previousData.current.temperature)
      setHumidity(previousData.current.humidity);
      setRain(previousData.current.rain);
      setWindow(windowRef.current)
    };

    loadData();

    const interval = setInterval(fetchWindow, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval)
  }, [])

  return (
    <SafeAreaView style={styles.container} >
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
        />

        <Buttons createPDF={createPDF} changeWindow={changeWindow} isOpen={window}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: width,
    height: height,
    zIndex: -1,
  },
  scrollView: {
    width: "100%",
    height: "100%",
  },
});
