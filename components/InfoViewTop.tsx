import { View, Text, StyleSheet } from "react-native";
import { Image } from "react-native";

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
    marginLeft: 20,
    marginRight: 20
  },
  infoView: {
    flex: 1,
    width: 105,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
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
