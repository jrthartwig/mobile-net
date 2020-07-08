import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const [tfReady, setTfReady] = useState(false);

  useEffect(async () => {
    await tf.ready();
    setTfReady(true);
  }, []);

  return (
    <View style={styles.container}>
      <Text>TFJS ready? {tfReady ? <Text>Yes</Text> : ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
