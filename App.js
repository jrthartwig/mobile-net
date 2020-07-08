import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { StyleSheet, Text, View } from "react-native";
import * as mobilenet from '@tensorflow-models/mobilenet';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions'; 
import * as jpeg from 'jpeg-js'; 


export default function App() {
  const [tfReady, setTfReady] = useState(false);
  const [modelReady, setModelReady] = useState(false); 
  const [predictions, setPredictions] = useState(null); 
  const [image, setImage] = useState(null);

  
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permission to make this work!')
      }
    }
  }

  classifyImage = async () => {
    try {
    const imageAssetPath = Image.resolveAssetSource(image)
    const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
    const rawImageData = await response.arrayBuffer()
    const imageTensor = imageToTensor(rawImageData)
    const predictions = await model.classify(imageTensor)
    setPredictions(predictions); 
    console.log(predictions)
    }
    catch (error) {
      console.log(error)
    }
  }

  imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true
    const {width, height, data} = jpeg.decode(rawImageData, TO_UINT8ARRAY)

    const buffer = new Uint8Array(width * height * 3)
    let offset = 0
    for(let i = 0; i < buffer.length; i +=3){
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3])

  }
  
  useEffect(async () => {
    await tf.ready()
    .then(setTfReady(true))
    await mobilenet.load()
    .then(setModelReady(true)); 


    getPermissionAsync(); 
  }, []);

  return (
    <View style={styles.container}>
      <Text>TFJS ready? {tfReady ? <Text>Si</Text> : ""}</Text>
      <Text>
        Model Ready?{''}
        {modelReady ? <Text>Yes</Text> : <Text>Loading Model...</Text>}
      </Text>
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
