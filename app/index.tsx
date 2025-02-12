import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

import { ButtonTouchable } from "@/components/ButtonTouchable";
import { Hour } from "@/components/Hour"

import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

import {
  initializeDB,
  saveDataDB,
  getDataDB,
} from "@/services/database";

import { saveFile, readFile } from "@/services/filesystem";

import {
  requestNotificationPermission,
  sendNotificiation,
} from "@/services/notifications";

import { generatePDF } from "@/services/reports";

export default function Index() {
  const [temperature, setTemperature] = useState("0");
  const [humidity, setHumidity] = useState("0");
  const [rain, setRain] = useState("0");
  const [timestamp, setTimestamp] = useState("");
  const [window, setWindow] = useState("open");

  const fetchData = async () => {
    try {
      const sensorResponse = await fetch('http://automate-house-production.up.railway.app/sensor/last');
      const sensorJson = await sensorResponse.json();
      
      const windowResponse = await fetch('http://automate-house-production.up.railway.app/window/state');
      const windowJson = await windowResponse.json();
      
      if(windowJson.state !== window) {
        setWindow(windowJson.state);
        saveFile(windowJson.state, "window.txt")

        if(windowJson.state === "open") {
          sendNotificiation("Janela", "Por causa da chuva, as janelas foram fechadas.")
        } else {
          sendNotificiation("Janela", "As janelas foram abertas.")
        }
      }
      
      if(sensorJson.temperature !== temperature || sensorJson.humidity !== humidity) {
        saveFile(sensorJson.temperature, "temperature.txt");
        saveFile(sensorJson.humidity, "humidity.txt");
        await saveDataDB(sensorJson.temperature, sensorJson.humidity, rain, sensorJson.timestamp);
      }
      
      setTemperature(sensorJson.temperature);
      setHumidity(sensorJson.humidity);
      setTimestamp(sensorJson.timestamp);

    } catch (error: any) {
      console.log("Error ", error.message);
    }
  }

  const send = async() => {
    const windowJSON = JSON.stringify({state: window === "open" ? "closed" : "open"})

    const windowResponse = await fetch('https://automate-house-production.up.railway.app/window/control', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: windowJSON
    })
  }

  useEffect(() => {
    const loadData = async () => {
      initializeDB();

      requestNotificationPermission();

      setTemperature(await readFile("temperature.txt"));
      setHumidity(await readFile("humidity.txt"));
      setRain(await readFile("rain.txt"));
      setWindow(await readFile("window.txt"));
    };

    loadData();
    
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);

  }, []);

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={["#FFFFFF", "#999999"]}
        style={styles.background}
      />

      <View style={styles.top}>
        <Image
          style={styles.image}
          source={require("@/assets/images/cloud-rain.svg")}
        />
        <Text style={styles.bigText}>{temperature}°C</Text>
      </View>

      <Hour />

      <View style={styles.infoViewTop}>
        <View style={styles.infoView}>
          <Image
            style={styles.icon}
            source={require("@/assets/images/sea-drop.png")}
          />
          <Text style={styles.infoNumber}>{humidity}%</Text>
          <Text style={styles.infoLabel}>Umidade</Text>
        </View>


        <View style={styles.infoView}>
          <Image
            style={styles.icon}
            source={require("@/assets/images/umbrella.png")}
          />
          <Text style={styles.infoNumber}>{rain}%</Text>
          <Text style={styles.infoLabel}>Chuva</Text>
        </View>
      </View>

      <View style={styles.inline}>
        <ButtonTouchable
          onClick={async () => {
            const data = await getDataDB()
            generatePDF(data)
          }}
          icon="pdf"
        />
        
        <ButtonTouchable
          onClick={() => {
            saveFile(window === 'open' ? 'close' : 'open', "window.txt");
            send()
          }}
          icon="window"
        />
      </View>
    </ThemedView>
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
    height: "100%",
    zIndex: -1,
  },
  top: {
    width: "100%",
    height: 172,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  infoViewTop: {
    flexDirection: "row",
    width: 334,
    height: 107,
    backgroundColor: "#D9D9D9",
    borderRadius: 150,
    borderColor: "#000000",
    borderWidth: 0.5,
    elevation: 10, // Sombra para Android
    shadowColor: "#000000", // Sombra para iOS
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    marginBottom: 90,
  },
  infoView: {
    flex: 1,
    width: 105,
    alignItems: "center",
    justifyContent: "center",
  },
  inline: {
    width: 273,
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
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
  bigText: {
    fontSize: 64,
    top: -16,
    fontFamily: "Itim",
  },
  infoNumber: {
    fontSize: 16,
    fontFamily: "Itim",
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: "Itim",
    opacity: 0.7,
    textAlign: "center",
  },
});
