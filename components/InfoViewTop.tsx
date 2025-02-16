import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "react-native";

import { rS, rVS, rMS } from "@/styles/responsive";

export interface Props {
  humidity?: string;
  rain?: string;
  stylesView?: any;
}

export function InfoViewTop({ humidity = "0", rain = "0", stylesView }: Props) {
  return (
    <View style={[styles.infoViewTop, stylesView]}>
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
  );
}

const styles = StyleSheet.create({
  infoViewTop: {
    flexDirection: "row",
    height: rVS(100),
    backgroundColor: "#D9D9D9",
    borderRadius: 150,
    borderColor: "#000000",
    borderWidth: 0.5,
    elevation: 10, // Sombra para Android
    shadowColor: "#000000", // Sombra para iOS
    shadowOffset: { width: rS(-2), height: rS(4) },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    marginLeft: rMS(20, 1.5),
    marginRight: rMS(20, 1.5)
  },
  infoView: {
    flex: 1,
    width: rS(105),
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: rS(24),
    height: rS(24),
  },
  infoNumber: {
    fontSize: rS(18),
    fontFamily: "Itim",
  },
  infoLabel: {
    fontSize: rS(13),
    fontFamily: "Itim",
    opacity: 0.7,
    textAlign: "center",
  },
});
