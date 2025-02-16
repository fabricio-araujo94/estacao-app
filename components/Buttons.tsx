import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import { rS, rVS, rMS } from "@/styles/responsive";

export interface Props {
    createPDF: () => {},
    changeWindow: () => {},
    isOpen: string
}

export function Buttons({createPDF, changeWindow, isOpen}: Props) {
  return (
    <View style={styles.inline}>
      <TouchableOpacity onPress={createPDF} style={styles.round}>
        <Image
          style={styles.icon}
          source={require("@/assets/images/pdf.png")}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={changeWindow} style={[styles.round, {
        backgroundColor: isOpen === "open" ?"#D9D9D9" : "#A6A6A6"
      }]}>
        <Image
          style={styles.icon}
          source={require("@/assets/images/window.svg")}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inline: {
    height: rS(100),
    flexDirection: "row",
    justifyContent: "space-between",
    margin: rMS(40, 2),
  },
  round: {
    width: rS(100),
    height: rS(100),
    justifyContent: "center",
    alignItems: "center",
    padding: rMS(10, 2),
    borderRadius: 100,
    borderColor: "#000000",
    borderWidth: 0.7,
    backgroundColor: "#D9D9D9"
  },
  icon: {
    width: rS(34),
    height: rS(34),
  },
});
