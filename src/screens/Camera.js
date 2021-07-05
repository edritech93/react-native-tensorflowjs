import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
  Text,
  ActivityIndicator,
} from 'react-native';
import {
  getModel,
  convertBase64ToTensor,
  startPrediction,
} from '../helpers/tensor-helper';
import { cropPicture } from '../helpers/image-helper';
import { RNCamera } from 'react-native-camera';
import ImgToBase64 from 'react-native-image-base64';
// import * as mobilenet from '@tensorflow-models/mobilenet';
// import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { TfImageRecognition } from 'react-native-tensorflow';

const RESULT_MAPPING = ['Triangle', 'Circle', 'Square'];

export default function Camera(props) {
  const cameraRef = useRef();
  const [isProcessing, setIsProcessing] = useState(false);
  const [presentedShape, setPresentedShape] = useState('');

  const handleImageCapture = async () => {
    try {
      setIsProcessing(true);
      const image = await cameraRef.current.takePictureAsync().catch((error) => {
        throw error;
      });
      ImgToBase64.getBase64String(image.uri)
        .then(base64String => {
          processImagePrediction(base64String);
        })
        .catch(error => {
          console.log('base64String => ', error);
        });
    } catch (error) {
      console.log('handleImageCapture => ', error);
    }
  };

  const processImagePrediction = async (base64Image) => {
    // const croppedData = await cropPicture(base64Image, 300);
    // const model = await getModel();
    // const tensor = await convertBase64ToTensor(croppedData.base64);

    // const prediction = await startPrediction(model, tensor);

    // const highestPrediction = prediction.indexOf(
    //   Math.max.apply(null, prediction),
    // );
    // setPresentedShape(RESULT_MAPPING[highestPrediction]);

    // https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg?w=1155&h=1528
  };


  // useEffect(() => {
  //   const sub = setInterval(async () => {
  //     const model = await mobilenet.load();
  //     // Load an image from the web
  //     const uri = 'https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg?w=1155&h=1528';
  //     const response = await fetch(uri, {}, { isBinary: true });
  //     const imageData = await response.arrayBuffer();
  //     const imageTensor = decodeJpeg(imageData);

  //     const prediction = (await model.predict(imageTensor))[0];
  //     console.log('------------------------------------');
  //     console.log('prediction => ', prediction);
  //     console.log('------------------------------------');
  //   }, 1000);
  //   return () => sub.cleanInterval();
  // }, [])

  useEffect(() => {
    async function _loadData() {
      

      const tfImageRecognition = new TfImageRecognition({
        model: require('../assets/tensorflow_inception_graph.pb'),
        labels: require('../assets/tensorflow_labels.txt'),
        imageMean: 117, // Optional, defaults to 117
        imageStd: 1 // Optional, defaults to 1
      })

      const results = await tfImageRecognition.recognize({
        image: require('../assets/dumbbell.jpg'),
        inputName: "input", //Optional, defaults to "input"
        inputSize: 224, //Optional, defaults to 224
        outputName: "output", //Optional, defaults to "output"
        maxResults: 3, //Optional, defaults to 3
        threshold: 0.1, //Optional, defaults to 0.1
      })

      results.forEach(result =>
        console.log(
          result.id, // Id of the result
          result.name, // Name of the result
          result.confidence // Confidence value between 0 - 1
        )
      )
    }
    _loadData()
  }, [])

  return (
    <View style={styles.container}>
      <Modal visible={isProcessing} transparent={true} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text>Your current shape is {presentedShape}</Text>
            {presentedShape === '' && <ActivityIndicator size="large" />}
            <Pressable
              style={styles.dismissButton}
              onPress={() => {
                setPresentedShape('');
                setIsProcessing(false);
              }}>
              <Text>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <RNCamera
        zoom={0}
        ratio={'16:9'}
        focusDepth={0}
        ref={cameraRef}
        captureAudio={false}
        style={styles.container}
        type={RNCamera.Constants.Type.front}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        whiteBalance={RNCamera.Constants.WhiteBalance.auto}></RNCamera>
      <Pressable
        onPress={() => handleImageCapture()}
        style={styles.captureButton}></Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  captureButton: {
    position: 'absolute',
    left: Dimensions.get('screen').width / 2 - 50,
    bottom: 40,
    width: 100,
    zIndex: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  modal: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
    borderRadius: 24,
    backgroundColor: 'gray',
  },
  dismissButton: {
    width: 150,
    height: 50,
    marginTop: 60,
    borderRadius: 24,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
});
