import React from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from "expo-image-manipulator";
import Layout from '../constants/Layout';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import getEnvVars from '../environment';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import BoundingBoxDraw from './BoundingBoxDraw';

const {apiUrl} = getEnvVars();

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
    boundingBox: null,
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
      this.setState({photo, predictionStatus: "WAITING"});
      const photoLow = await this.resize(photo);
      const prediction = await this.predict(photoLow.base64);
      console.log("prediction", prediction);
      const scores = prediction["outputs"]["scores"][0];
      const labels = prediction["outputs"]["classes"];
      const confidence = Math.max(...scores);
      const predictedLabel = labels.length > 0 ? labels[scores.indexOf(confidence)] : "NO_LABEL";
      this.setState({prediction, confidence, photo, photoLow, predictionStatus: "OK", predictedLabel});
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

  crop = async (uri, boundingBox) => {
    const crop = {
      originX: boundingBox.x1,
      originY: boundingBox.y1,
      width: boundingBox.x2 - boundingBox.x1,
      height: boundingBox.y2 - boundingBox.y1,
    }
    return ImageManipulator.manipulateAsync(
      uri,
      [{crop}],
      {format: ImageManipulator.SaveFormat.JPEG},
    );
  };

  base64WebSafe = (base64) => base64.replace(/(?:\r\n|\r|\n)/g, '').replace(/\+/g, '-').replace(/\//g, '_').split(',').pop();

  predict = async (base64) => {
    let body = JSON.stringify({
      "signature_name": "decode_and_serve",
      "inputs": {"image_bytes": [this.base64WebSafe(base64)]},
    });

    if (!this.state.overwrite) {
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
    }
    return responseStub
  };

  sendPredictionFeedback = async () => {
    let crop = this.state.photo
    if (this.state.boundingBox) {
      crop = await this.crop(this.state.photo.uri, this.state.boundingBox)
    }
    const cropLow = await this.resize(crop)

    let body = JSON.stringify({
      "signature_name": "set_support_set",
      "inputs": {
        "image_bytes": [this.base64WebSafe(cropLow.base64)],
        "crop_window": [[0, 0, cropLow.height, cropLow.width]],
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
      this.setState({
        support_set_loss: response_body["outputs"][0],
        overwrite: false,
        predictedLabel: null,
        predictionStatus: null,
        boundingBox: null,
      })
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

  renderPredictionTopBar = () =>
    <View style={{flexDirection: "column", justifyContent: "space-between", flex: 0.20}}>
      <View style={{
        flex: 0.8,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        width: Layout.window.width,
      }}>
        <TextInput
          onChangeText={this.handlePredictionCorrection}
          value={this.state.predictedLabel}
          selectTextOnFocus={true}
          style={{
            fontWeight: 'bold',
            fontSize: 25,
            textAlign: 'center',
            color: 'black',
          }}
          ref={(ref) => {
            this.labelInput = ref
          }}
        />
      </View>
      {this.state.predictedLabel &&
      <View style={{
        flex: 0.2,
        flexDirection: 'column',
        justifyContent: 'bottom',
        width: Layout.window.width,
      }}>
        <ProgressBarAnimated
          width={Layout.window.width}
          value={this.state.confidence * 100}
          backgroundColor={this.state.confidence < 0.5 ? "red" : this.state.confidence < 0.75 ? "yellow" : "green"}
          borderRadius={0}
          borderColor="white"
          borderWidth={0}
        />
      </View>}
    </View>;

  renderPrediction = () =>
    <View style={{flex: 1}}>
      <ImageBackground style={styles.camera} source={{uri: this.state.photo.uri}}>
        {this.renderPredictionTopBar()}
        {!this.state.predictedLabel &&
        <View style={{flex: 1, flexDirection: "columns", justifyContent: "center"}}><ActivityIndicator size="large"
                                                                                                       color="white"/></View>}
        {this.state.predictedLabel && <BoundingBoxDraw handleBoundingBoxChange={(boundingBox) => {
          this.setState({boundingBox})
        }}/>}
        {this.state.predictedLabel && this.renderPredictionBottomBar()}
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
    flex: 0.2,
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
