import { Image } from "expo-image";
import { Text, View, StyleSheet } from "react-native";

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
    width: "100%",
    height: 172,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  image: {
    width: 122,
    height: 122,
    marginTop: 20,
  },

  bigText: {
    fontSize: 64,
    top: -16,
    fontFamily: "Itim",
  },
});
