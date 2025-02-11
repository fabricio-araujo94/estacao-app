import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

import { initializeDB, getDataDB, type State } from "../services/database";

import { CartesianChart, Line, Scatter } from "victory-native";
import { useFont } from "@shopify/react-native-skia";


export default function Report() {
  const [reportData, setReportData] = useState([{
    id: 1,
    temperature: 0,
    humidity: 0,
    pressure: 0,
    rain: 0,
    timestamp: "20-10-2002 10:10:10"
  }])
  

  useEffect(() => {
    initializeDB()
    const result = getDataDB()
    setReportData(result)
  }, [])

  
  return (
    <View style={styles.container}>
      <CartesianChart
        data={reportData} // 👈 specify your data
        xKey="id" // 👈 specify data key for x-axis
        yKeys={["temperature", "humidity", "pressure", "rain"]} // 👈 specify data keys used for y-axis
        padding={{left: 10, right: 10, top: 10, bottom: 10}}
        axisOptions={{
          font: useFont('Itim', 12)
        }}
      >
        {/* 👇 render function exposes various data, such as points. */}
        {({ points }) => (
          // 👇 and we'll use the Line component to render a line path.
          <Line
          points={points.temperature}
          color="red"
          strokeWidth={3}
          animate={{ type: "timing", duration: 300 }}
          connectMissingData={true}
          
        />
        )}
      </CartesianChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
  },
});
