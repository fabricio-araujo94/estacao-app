import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location"

import { saveFile, readFile } from "@/services/filesystem";

export function Hour() {
  const [hour, setHour] = useState(new Date());
  const [localization, setLocalization] = useState({
    cidade: "",
    estado: ""
  })

  const getLocation = async () => {
    var cidade = await readFile("cidade.txt")
    var estado = await readFile("estado.txt")

    setLocalization({
      cidade: cidade,
      estado: estado
    })

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Permissão para acesso à localização negada!');
        return;
      }

      // Pega a latitude e a longitude.
      let location = await Location.getCurrentPositionAsync({});
      
      // Retorna um array de endereços.
      let enderecos = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (enderecos.length > 0) {
        console.log(enderecos)
        const endereco = enderecos[0];

        // Se endereços é maior que 0, então é garantido que esses
        // dados existam.
        setLocalization({
          cidade: endereco.city! || endereco.subregion!,
          estado: endereco.region!,
        });

        saveFile(localization.cidade, "cidade.txt")
        saveFile(localization.estado, "estado.txt")
      }
    } catch (error: any) {
      console.log('Erro ao obter localização: ' + error.message);
    }
  }

  useEffect(() => {
    getLocation()

    const timer = setInterval(() => {
      setHour(new Date());
    }, 1000);


    return () => clearInterval(timer); 
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.local}>{localization.cidade} - {localization.estado}</Text>
      <Text style={styles.hour}>
        {hour.getHours()}:{String(hour.getMinutes()).padStart(2, '0')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 41,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 120,
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
});
