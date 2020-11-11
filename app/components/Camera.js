import React from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { EvilIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as tf from "@tensorflow/tfjs"
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import preprocessing from '../models/preprocessing';
import encoder from '../models/encoder';
import kernel from '../models/kernel';
import { connect } from 'react-redux';
import { updatePrediction } from '../actions/predictionActions';
import { compressJpeg, encodeJpeg } from '../utils/tensorUtils';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const TensorCamera = cameraWithTensors(Camera)

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  noPermissionsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'white',
  },
  cameraView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  camera: {
    position: 'absolute',
    left: 0,
    top: 0,
    width,
    height,
    zIndex: 0,
  },
  topBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: "100%",
    height: Math.floor(0.2 * height),
    zIndex: 20,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: "100%",
    height: Math.floor(0.2 * height),
    zIndex: 20,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomBarCenterContainer: {
    flex: 0.5,
  },
  bottomBarSideContainer: {
    flex: 0.25,
  },
  bottomBarIcon: {
    alignSelf: 'center',
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
});

const textureDims = Platform.OS === "ios"? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };

class CameraScreen extends React.Component {
  rafID;
  isRecording=false;

  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    cameraPermissionsGranted: false,
    cameraRollPermissionsGranted: false,
    predictions: [],
  };

  allowCameraPermission = async () => {
    if (!this.state.cameraPermissionsGranted) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({cameraPermissionsGranted: status === 'granted'});
    }
  }

  allowCameraRollPermission = async () => {
    if (!this.state.cameraRollPermissionsGranted) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({cameraRollPermissionsGranted: status === 'granted'});
    }
  }

  componentDidMount = async () => {
    await this.allowCameraPermission();
    await this.allowCameraRollPermission();
  };

  toggleFacing = () => this.setState({type: this.state.type === 'back' ? 'front' : 'back'});

  toggleFlash = () => this.setState({flash: flashModeOrder[this.state.flash]});

  toggleWB = () => this.setState({whiteBalance: wbOrder[this.state.whiteBalance]});

  toggleFocus = () => this.setState({autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on'});

  onPressRadioIn = () => {this.isRecording = true};

  onPressRadioOut = () => {
    this.isRecording = false;
    this.props.updatePrediction({predictions: this.state.predictions})
    this.setState({predictions: []});
    this.props.toggleModal()
  }

  openImagePickerAsync = async () => {
    await this.allowCameraRollPermission();
    const photo = await ImagePicker.launchImageLibraryAsync({allowsEditing: false});
    if (!photo.cancelled) {
      this.props.openImagePickerAsync(photo)
    }
  }

  predict = (tensor) => {
    const embedding = encoder.predict(preprocessing.predict(tensor))
    let confidence = 0
    let label = "NO_LABEL"
    let index = 0
    const supportEmbeddings = this.props.supportSet.map((x) => x.embedding)
    const supportLabels = this.props.supportSet.map((x) => x.label)
    if (supportEmbeddings.length > 0) {
      const scores = kernel.predict([
        embedding.tile([supportEmbeddings.length, 1]),
        tf.concat(supportEmbeddings),
      ])
      confidence = scores.max().dataSync()[0]
      index = scores.argMax().dataSync()[0]
      label = supportLabels[index]
    }
    return {embedding, label, confidence, index}
  }

  handleCameraStream = (stream) => {
    const loop = async () => {
      if (this.isRecording) {
        let tensor = stream.next().value.reverse(1)

        const prediction = await Promise.all([
          encodeJpeg(tensor),
          compressJpeg(tensor, 10).then((t) => this.predict(t)),
        ]).then((arr) => arr.reduce((x, y) => ({...x, ...y}), {}))
        tf.dispose([tensor]);

        this.setState({predictions: [...this.state.predictions, prediction]})
      }

      this.rafID = requestAnimationFrame(loop);
    }

    loop();
  }

  componentWillUnmount() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
    }
  }

  renderTopBar = () =>
    <View style={styles.topBar}>
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

  renderBottomBar = () =>
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarSideContainer}>
        <TouchableOpacity style={styles.bottomBarIcon} onPress={this.openImagePickerAsync}>
          <EvilIcons name="image" size={60} color="white"/>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBarCenterContainer}>
        <TouchableOpacity style={styles.bottomBarIcon}
                          onPressIn={this.onPressRadioIn}
                          onPressOut={this.onPressRadioOut}>
          <Ionicons name="ios-radio-button-on" size={70} color={this.isRecording ? "red" : "white"}/>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBarSideContainer}/>
    </View>;

  renderCamera = () =>
    (
      <View style={styles.cameraView}>
        {this.renderTopBar()}
        <TensorCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.camera}
          type={this.state.type}
          flashMode={this.state.flash}
          autoFocus={this.state.autoFocus}
          zoom={this.state.zoom}
          whiteBalance={this.state.whiteBalance}
          ratio={this.state.ratio}
          // Tensor related props
          cameraTextureHeight={textureDims.height}
          cameraTextureWidth={textureDims.width}
          resizeHeight={224}
          resizeWidth={Math.ceil(width * 224 / height)}
          resizeDepth={3}
          onReady={this.handleCameraStream}
          autorender={true}
        />
        {this.renderBottomBar()}
      </View>
    );

  renderNoPermissions = () =>
    <View style={styles.noPermissions}>
      <Text style={styles.noPermissionsText}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
      <Button
        onPress={this.allowCameraPermission}
        title="Allow camera"
        color="white"
      />
    </View>;

  render() {
    return <View
      style={styles.container}>{this.state.cameraPermissionsGranted ? this.renderCamera() : this.renderNoPermissions()}</View>;
  }
}

const mapStateToProps = (state) => ({
  supportSet: state.supportSet,
});

const mapDispatchToProps = (dispatch) => ({
  updatePrediction: (prediction) => dispatch(updatePrediction(prediction)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen)
