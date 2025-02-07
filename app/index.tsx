import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

import Paho from "paho-mqtt";

import { File, Paths } from 'expo-file-system/next'

import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

import { ButtonTouchable } from "@/components/ButtonTouchable";

const client = new Paho.Client(
  "broker.hivemq.com",
  Number(8000),
  `mqtt-async-test-${parseInt(String(Math.random() * 100).toString())}`
);

export default function Index() {
  const [temperature, setTemperature] = useState("38°C");
  const [humidity, setHumidity] = useState("30%");
  const [pressure, setPressure] = useState("5 atm");
  const [rain, setRain] = useState("30%");
  const [window, setWindow] = useState(true);
  const [clothesHanging, setClothesHanging] = useState(true);
  const [topic, setTopic] = useState("estacao");

  function onMessage(newMessage: Paho.Message) {
    if (newMessage.destinationName === "estacao/temperature") {
      setTemperature(newMessage.payloadString);
      saveFile(newMessage.payloadString, 'temperature.txt');
    }

    if (newMessage.destinationName === "estacao/humidity") {
      setHumidity(newMessage.payloadString);
      saveFile(newMessage.payloadString, 'humidity.txt');
    }

    if (newMessage.destinationName === "estacao/pressure") {
      setPressure(newMessage.payloadString);
      saveFile(newMessage.payloadString, 'pressure.txt');
    }

    if (newMessage.destinationName === "estacao/rain") {
      setRain(newMessage.payloadString);
      saveFile(newMessage.payloadString, 'rain.txt');
    }

    if (newMessage.destinationName === "estacao/window") {
      setWindow(newMessage.payloadString === 'true');
      saveFile(newMessage.payloadString, 'window.txt');
    }
    
    if (newMessage.destinationName === "estacao/clothesHanging") {
      setClothesHanging(newMessage.payloadString === 'true');
      saveFile(newMessage.payloadString, 'clothesHanging.txt');
    }
  }

  function changeState(c: Paho.Client, topic: string, message: boolean) {
    const newMessage = new Paho.Message(message.toString());
    newMessage.destinationName = topic;
    c.send(newMessage);
  }

  function saveFile(value: string, directory: string) {
    try {
      const file = new File(Paths.document, directory);
      
      if(!file.exists) {
        file.create();
      }

      file.write(value);
    } catch (error: any) {
      console.log('Error: ' + error.message)
    }
  }

  function readFile(directory: string): string {
    var message: string = ''
    
    try {
      const file = new File(Paths.document, directory);
      
      if(!file.exists) {
        file.create();
      }

      message = file.text();
    } catch (error: any) {
      console.log('Error: ' + error.message)
    }

    return message
  }

  useEffect(() => {
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
        <Text style={styles.bigText}>{temperature}</Text>
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
          <Text style={styles.infoNumber}>{humidity}</Text>
          <Text style={styles.infoLabel}>Umidade</Text>
        </View>

        <View style={styles.infoView}>
          <Image
            style={styles.icon}
            source={require("@/assets/images/barometer.png")}
          />
          <Text style={styles.infoNumber}>{pressure}</Text>
          <Text style={styles.infoLabel}>Pressão Atmosférica</Text>
        </View>

        <View style={styles.infoView}>
          <Image
            style={styles.icon}
            source={require("@/assets/images/umbrella.png")}
          />
          <Text style={styles.infoNumber}>{rain}</Text>
          <Text style={styles.infoLabel}>Chuva</Text>
        </View>
      </View>

      <View style={styles.inline}>
        <ButtonTouchable onClick={() => {
          changeState(client, 'estacao/window', !window)
          setWindow(!window)
        }} icon="window" />

        <ButtonTouchable onClick={() => {
          changeState(client, 'estacao/clothesHanging', !clothesHanging)
          setClothesHanging(!clothesHanging)
        }} icon="clothes" />
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
    width: 135,
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
