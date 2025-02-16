import { Image } from "expo-image";
import { Text, View, StyleSheet, Dimensions } from "react-native";

import { rS, rVS, rMS } from "@/styles/responsive";

export interface Props {
    temperature?: string
}

export function TopTemperature({temperature = "0"}: Props) {
  return (
    <View style={styles.top}>
      <Image
        style={styles.image}
        source={require("@/assets/images/cloud-rain.svg")}
      />
      <Text style={styles.bigText}>{temperature}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    height: rVS(172),
    justifyContent: "center",
    alignItems: "center",
    marginTop: rMS(40, 2),
  },
  image: {
    width: rS(122),
    height: rS(122),
  },

  bigText: {
    fontSize: rS(64),
    top: rMS(-16, -2),
    fontFamily: "Itim",
  },
});
