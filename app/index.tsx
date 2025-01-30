import { View, Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

import { LinearGradient } from "expo-linear-gradient";

import { ButtonTouchable } from "@/components/ButtonTouchable";

export default function Index() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LinearGradient 
        colors={['#FFFFFF', "#999999"]}
        style={styles.background}
      />

      <View style={styles.inline}>
        <ButtonTouchable
          onClick={() => {}}
          icon='window'
        />

        <ButtonTouchable
          onClick={() => {}}
          icon='clothes'
        />
      </View>


      <Text>Edit app/index.tsx to edit this screen.</Text>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  inline: {
    //flex: 1,
    width: 273,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})