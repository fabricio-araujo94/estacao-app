import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ButtonTouchable } from "@/components/ButtonTouchable";
import { Link } from "expo-router";

import Paho from "paho-mqtt";

import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

import {
  initializeDB,
  saveDataDB,
  getDataDB,
  deleteDataDB,
} from "@/services/database";

import { saveFile, readFile } from "@/services/filesystem";

import {
  requestNotificationPermission,
  sendNotificiation,
} from "@/services/notifications";

const client = new Paho.Client(
  "broker.hivemq.com",
  Number(8000),
  `mqtt-async-test-${parseInt(String(Math.random() * 100).toString())}`
);


export default function Index() {
  const [temperature, setTemperature] = useState("0");
  const [humidity, setHumidity] = useState("0");
  const [rain, setRain] = useState("0");
  const [timestamp, setTimestamp] = useState("");
  const [window, setWindow] = useState("open");

  const onMessage = (newMessage: Paho.Message) => {
    console.log(newMessage.payloadString)
  }

  function changeState(c: Paho.Client, topic: string, message: string) {
    try {
      const newMessage = new Paho.Message(message);
      newMessage.destinationName = topic;
      c.send(newMessage);  
    } catch (error: any) {
      console.log("Error: ", error.message)
    }
  }

  const fetchData = async () => {
    try {
      // Primeira requisição
      const sensorResponse = await fetch('http://automate-house-production.up.railway.app/sensor/last');
      const sensorJson = await sensorResponse.json();
      
      // Atualizando o estado com as respostas do sensor
      setTemperature(sensorJson.temperature);
      setHumidity(sensorJson.humidity);
      setTimestamp(sensorJson.timestamp);
      
      // Segunda requisição
      const windowResponse = await fetch('http://automate-house-production.up.railway.app/window/state');
      const windowJson = await windowResponse.json();
      
      // Atualizando o estado do estado da janela
      setWindow(windowJson.state);
  
      // Agora que o estado está atualizado, você pode salvar no banco de dados
      saveFile(sensorJson.temperature, "temperature.txt");
      saveFile(sensorJson.humidity, "humidity.txt");
      saveFile(windowJson.state, "window.txt");
      
      // Salvar os dados no banco de dados, com os valores já obtidos
      await saveDataDB(sensorJson.temperature, sensorJson.humidity, rain, sensorJson.timestamp);
      
      // Exibir os dados do banco de dados (se necessário)
      await getDataDB();
  
    } catch (error: any) {
      console.log("Error ", error.message);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      initializeDB();

      requestNotificationPermission();

      client.connect({
        onSuccess: () => {
          console.log("Connected");
          client.subscribe("estacao/#");
          client.onMessageArrived = onMessage;
        },
        onFailure: () => {
          console.log("Failed to connect");
        },
      });

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

      <View style={styles.top2}>
        <Text style={styles.local}>Maracanaú - Ceará</Text>
        <Text style={styles.hour}>10:30</Text>
      </View>

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
          onClick={() => {
            changeState(client, "estacao/window", window === 'open' ? 'close' : 'open');
            saveFile(window === 'open' ? 'close' : 'open', "window.txt");
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
  top2: {
    width: 130,
    height: 41,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 120,
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
    justifyContent: "center",
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
  local: {
    fontSize: 15,
    fontFamily: "Itim",
    opacity: 0.67,
  },
  hour: {
    fontSize: 24,
    fontFamily: "Caprasimo",
    opacity: 0.53,
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
