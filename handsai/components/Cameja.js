import React from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from "expo-image-manipulator";
import Layout from '../constants/Layout';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import getEnvVars from '../environment';

const { apiUrl } = getEnvVars();

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  auto: 'flash-auto',
  torch: 'highlight',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const wbIcons = {
  auto: 'wb-auto',
  sunny: 'wb-sunny',
  cloudy: 'wb-cloudy',
  shadow: 'beach-access',
  fluorescent: 'wb-iridescent',
  incandescent: 'wb-incandescent',
};

const responseStub = {
  'outputs': {
    "classes": [],
    "scores": [[]],
  },
};

export default class CameraScreen extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    photo: null,
    photoLow: null,
    permissionsGranted: false,
    prediction: null,
    predictionStatus: null,
    predictedLabel: null,
    support_set_loss: null,
    overwrite: true,
  };

  componentDidMount = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({permissionsGranted: status === 'granted'});
  };

  toggleFacing = () => this.setState({type: this.state.type === 'back' ? 'front' : 'back'});

  toggleFlash = () => this.setState({flash: flashModeOrder[this.state.flash]});

  toggleWB = () => this.setState({whiteBalance: wbOrder[this.state.whiteBalance]});

  toggleFocus = () => this.setState({autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on'});

  takePicture = async () => {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync({quality: 0});
      console.log("photo", photo);
      this.setState({photo, predictionStatus: "WAITING"});
      const photoLow = await this.resize(photo);
      console.log("photoLow", photoLow);
      const prediction = await this.predict(photoLow.base64);
      console.log("prediction", prediction);
      const scores = prediction["outputs"]["scores"][0];
      const labels = prediction["outputs"]["classes"];
      let predictedLabel = labels.length > 0 ? labels[scores.indexOf(Math.max(...scores))] : "NO_LABEL";
      this.setState({prediction, photo, photoLow, predictionStatus: "OK", predictedLabel});
    }
  };

  handleMountError = ({message}) => console.error(message);

  resize = async (photo) => {
    const resize = photo.width < photo.height ? {height: 224} : {width: 224};
    return ImageManipulator.manipulateAsync(
      photo.uri,
      [{resize}],
      {compress: 0.1, format: ImageManipulator.SaveFormat.JPEG, base64: true},
    );
  };

  base64WebSafe = (base64) => base64.replace(/(?:\r\n|\r|\n)/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  predict = async (base64) => {
    let body = JSON.stringify({
      "signature_name": "decode_and_serve",
      "inputs": {"image_bytes": [this.base64WebSafe(base64).split(',').pop()]},
    });

    try {
      let response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      });
      if (response.ok) {
        return await response.json()
      }
    } catch (e) {
      console.log(e)
    }
    return responseStub
  };

  sendPredictionFeedback = async () => {
    this.setState({predictionStatus: null});

    let body = JSON.stringify({
      "signature_name": "set_support_set",
      "inputs": {
        "image_bytes": [this.base64WebSafe(this.state.photoLow.base64).split(',').pop()],
        "crop_window": [[0, 0, this.state.photoLow.height, this.state.photoLow.width]],
        "label": [this.state.predictedLabel],
        "overwrite": this.state.overwrite,
      },
    });

    let response = await fetch(`${apiUrl}/predict`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    if (response.ok) {
      const response_body = await response.json();
      console.log("catalog loss", response_body["outputs"][0]);
      this.setState({support_set_loss: response_body["outputs"][0], overwrite: false, predictedLabel: null})
    }
  };

  renderNoPermissions = () =>
    <View style={styles.noPermissions}>
      <Text style={{color: 'white'}}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>;

  renderTopBar = () =>
    <View
      style={styles.topBar}>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFacing}>
        <Ionicons name="ios-reverse-camera" size={32} color="white"/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFlash}>
        <MaterialIcons name={flashIcons[this.state.flash]} size={32} color="white"/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleWB}>
        <MaterialIcons name={wbIcons[this.state.whiteBalance]} size={32} color="white"/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFocus}>
        <Text style={[styles.autoFocusLabel, {color: this.state.autoFocus === 'on' ? "white" : "#6b6b6b"}]}>AF</Text>
      </TouchableOpacity>
    </View>;

  renderCameraBottomBar = () =>
    <View style={styles.bottomBar}>
      <TouchableOpacity
        onPress={this.takePicture}
        style={{alignSelf: 'center'}}
      >
        <Ionicons name="ios-radio-button-on" size={70} color="white"/>
      </TouchableOpacity>
    </View>;

  handleLabelReject = () => this.labelInput.focus();

  renderPredictionBottomBar = () =>
    <View style={styles.bottomBar}>
      <TouchableOpacity
        onPress={this.handleLabelReject}
        style={{alignSelf: 'center'}}
      >
        <FontAwesome name="times-circle" size={60} style={styles.labelKo}/>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.sendPredictionFeedback}
        style={{alignSelf: 'center'}}
      >
        <FontAwesome name="check-circle" size={60} style={styles.labelOk}/>
      </TouchableOpacity>
    </View>;

  renderPrediction = () =>
    <View style={{flex: 1}}>
      <ImageBackground style={styles.camera} source={{uri: this.state.photo.uri}}>
        <View style={{
          flex: 0.1,
          backgroundColor: 'white',
          flexDirection: 'column',
          justifyContent: 'center',
          width: Layout.window.width,
        }}>
          <TextInput
            onChangeText={this.handlePredictionCorrection}
            value={this.state.predictedLabel}
            clearTextOnFocus={true}
            style={{
              fontWeight: 'bold',
              fontSize: 25,
              textAlign: 'center',
              color: 'black',
            }}
            ref={(ref) => {this.labelInput = ref}}
          />
        </View>
        {!this.state.predictedLabel && <ActivityIndicator size="large" color="white" />}
        {this.renderPredictionBottomBar()}
      </ImageBackground>
    </View>;

  handlePredictionCorrection = (predictedLabel) => this.setState({predictedLabel});

  renderCamera = () =>
    (
      <View style={{flex: 1}}>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.camera}
          type={this.state.type}
          flashMode={this.state.flash}
          autoFocus={this.state.autoFocus}
          zoom={this.state.zoom}
          whiteBalance={this.state.whiteBalance}
          ratio={this.state.ratio}
          onMountError={this.handleMountError}
        >
          {this.renderTopBar()}
          {this.renderCameraBottomBar()}
        </Camera>
      </View>
    );

  render() {
    const cameraScreenContent = this.state.permissionsGranted
                                ? this.renderCamera()
                                : this.renderNoPermissions();
    const content = !!this.state.predictionStatus ? this.renderPrediction() : cameraScreenContent;
    return <View style={styles.container}>{content}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  labelBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    width: Layout.window.width,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  bottomBar: {
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    flex: 0.15,
    flexDirection: 'row',
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  toggleButton: {
    flex: 0.25,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  labelOk: {color: "rgb(84,255,34)"},
  labelKo: {color: "#c3483c"},
});
