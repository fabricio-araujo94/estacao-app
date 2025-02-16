import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import * as Location from "expo-location"

import { rS, rMS } from "@/styles/responsive";

export function Hour() {
  const [hour, setHour] = useState(new Date());
  const [localization, setLocalization] = useState({
    cidade: "",
    estado: ""
  })

  const getLocation = async () => {   
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

      }
    } catch (error: any) {
      console.log('Erro ao obter localização: ' + error.message);
    }
  }

  useEffect(() => {
    getLocation();

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
    height: rS(41),
    alignItems: "center",
    marginTop: rMS(10, 2),
    marginBottom: rMS(60, 2),
  },
  local: {
    fontSize: rS(17),
    fontFamily: "Itim",
    opacity: 0.67,
  },
  hour: {
    fontSize: rS(22),
    fontFamily: "Caprasimo",
    opacity: 0.53,
  },
});
