import { View, Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";


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

      <View style={styles.top}>
        <Image
          style={styles.image}
          source={require('@/assets/images/cloud-rain.svg')}
        />
        <Text style={styles.bigText}>30°C</Text>
      </View>

      <View style={styles.top}>
        <Text style={styles.local}>Maracanaú - Ceará</Text>
        <Text style={styles.hour}>10:30</Text>
      </View>

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
    justifyContent: 'space-between',
    paddingBottom: 50
  },
  image: {
    width: 122,
    height: 122,
  },
  bigText: {
    fontSize: 64,
    top: -16,
    fontFamily: 'Itim'
  },
  top: {
    flex: 1,
    width: '50%',
    height: 174,
    justifyContent: 'center',
    alignItems: 'center',
  },
  top2: {
    flex: 1,
    width: '50%',
    height: 41,
    justifyContent: 'center',
    alignItems: 'center',
  },
  local: {
    fontSize: 15,
    fontFamily: 'Itim',
    opacity: 0.67
  },
  hour: {
    fontSize: 24,
    fontFamily: 'Caprasimo',
    opacity: 0.53
  }
})