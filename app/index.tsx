import { View, Text, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

import { ButtonTouchable } from "@/components/ButtonTouchable";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
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

      <View style={styles.top2}>
        <Text style={styles.local}>Maracanaú - Ceará</Text>
        <Text style={styles.hour}>10:30</Text>
      </View>

      <View style={styles.infoViewTop}>
        <View style={styles.infoView}>
          <Image
            style={styles.icon}
            source={require('@/assets/images/sea-drop.png')}
          />
          <Text style={styles.infoNumber}>30%</Text>
          <Text style={styles.infoLabel}>Umidade</Text>
        </View>
        
        <View style={styles.infoView}>
          <Image
            style={styles.icon}
            source={require('@/assets/images/barometer.png')}
          />
          <Text style={styles.infoNumber}>5 atm</Text>
          <Text style={styles.infoLabel}>Pressão Atmosférica</Text>
        </View>
        
        <View style={styles.infoView}>
          <Image
            style={styles.icon}
            source={require('@/assets/images/umbrella.png')}
          />
          <Text style={styles.infoNumber}>30%</Text>
          <Text style={styles.infoLabel}>Chuva</Text>
        </View>
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
  container: {
    flex: 1, 
    width: '100%',
    height: '100%',
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute', 
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    zIndex: -1,
  },
  top: {
    width: 135,
    height: 172,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40, 
  },
  top2: {
    width: 130,
    height: 41,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 120
  },
  infoViewTop: {
    flexDirection: 'row',
    width: 334,
    height: 107,
    backgroundColor: '#D9D9D9',
    borderRadius: 150,
    borderColor: '#000000',
    borderWidth: 0.5,
    elevation: 10, // Sombra para Android
    shadowColor: '#000000', // Sombra para iOS
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    marginBottom: 90,
  },
  infoView: {
    flex: 1,
    width: 105,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    width: 273,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontFamily: 'Itim',
  },
  local: {
    fontSize: 15,
    fontFamily: 'Itim',
    opacity: 0.67,
  },
  hour: {
    fontSize: 24,
    fontFamily: 'Caprasimo',
    opacity: 0.53,
  },
  infoNumber: {
    fontSize: 16,
    fontFamily: 'Itim',
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'Itim',
    opacity: 0.7,
    textAlign: 'center',
  },
})