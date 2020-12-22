import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { EvilIcons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { connect } from "react-redux";
import { requestPrediction } from "../actions/predictionActions";
import { loadUri } from "../utils/tensorUtils";
import { resizeWithPad } from "../utils/imageUtils";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const TensorCamera = cameraWithTensors(Camera);

const wbOrder = {
  auto: "sunny",
  sunny: "cloudy",
  cloudy: "shadow",
  shadow: "fluorescent",
  fluorescent: "incandescent",
  incandescent: "auto",
};

const wbIcons = {
  auto: "wb-auto",
  sunny: "wb-sunny",
  cloudy: "wb-cloudy",
  shadow: "beach-access",
  fluorescent: "wb-iridescent",
  incandescent: "wb-incandescent",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPermissions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  noPermissionsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  cameraView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  camera: {
    position: "absolute",
    left: 0,
    top: 0,
    width,
    height,
    zIndex: 0,
  },
  topBar: {
    position: "absolute",
    left: 0,
    top: 15,
    width: "100%",
    height: Math.floor(0.2 * height),
    zIndex: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: Math.floor(0.2 * height),
    zIndex: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomBarCenterContainer: {
    flex: 0.5,
  },
  bottomBarSideContainer: {
    flex: 0.25,
  },
  bottomBarIcon: {
    alignSelf: "center",
  },
  toggleButton: {
    flex: 0.25,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

const textureDims =
  Platform.OS === "ios" ? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };

class CameraScreen extends React.Component {
  rafID;

  isRecording = false;

  constructor(props) {
    super(props);

    this.state = {
      quality: "low",
      zoom: 0,
      type: "back",
      whiteBalance: "auto",
      ratio: "16:9",
      cameraPermissionsGranted: false,
      cameraRollPermissionsGranted: false,
    };
  }

  componentDidMount = async () => {
    await this.allowCameraPermission();
    await this.allowCameraRollPermission();
  };

  componentWillUnmount() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
    }
  }

  allowCameraPermission = async () => {
    if (!this.state.cameraPermissionsGranted) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ cameraPermissionsGranted: status === "granted" });
    }
  };

  allowCameraRollPermission = async () => {
    if (!this.state.cameraRollPermissionsGranted) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ cameraRollPermissionsGranted: status === "granted" });
    }
  };

  toggleFacing = () =>
    this.setState((prevState) => ({
      type: prevState.type === "back" ? "front" : "back",
    }));

  toggleWB = () =>
    this.setState((prevState) => ({ whiteBalance: wbOrder[prevState.whiteBalance] }));

  toggleFocus = () => {
    this.props.swiper();
  };

  onPressRadioIn = () => {
    this.isRecording = true;
  };

  onPressRadioOut = () => {
    this.isRecording = false;
    this.props.toggleModal();
  };

  openImagePickerAsync = async () => {
    await this.allowCameraRollPermission();
    const photo = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
    });
    if (!photo.cancelled) {
      const photoLow = await resizeWithPad(224, 224, { base64: false })(photo);
      const tensor = await loadUri(photoLow.uri);
      this.props.requestPrediction(tensor, this.props.supportSet, photoLow);
      this.props.toggleModal();
    }
  };

  handleCameraStream = (stream) => {
    const loop = () => {
      if (this.isRecording) {
        const tensor = stream.next().value.reverse(1);
        this.props.requestPrediction(tensor, this.props.supportSet);
      }

      this.rafID = requestAnimationFrame(loop);
    };

    loop();
  };

  renderTopBar = () => (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFacing}>
        <Ionicons name="ios-reverse-camera" size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleWB}>
        <MaterialIcons name={wbIcons[this.state.whiteBalance]} size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFocus}>
        <Ionicons name="ios-images" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );

  renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarSideContainer}>
        <TouchableOpacity
          style={styles.bottomBarIcon}
          onPress={this.openImagePickerAsync}
        >
          <EvilIcons name="image" size={60} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBarCenterContainer}>
        <TouchableOpacity
          style={styles.bottomBarIcon}
          onPressIn={this.onPressRadioIn}
          onPressOut={this.onPressRadioOut}
        >
          <Ionicons
            name="ios-radio-button-on"
            size={70}
            color={this.isRecording ? "red" : "white"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBarSideContainer} />
    </View>
  );

  renderCamera = () => {
    const resizeWidth =
      this.state.quality === "high" ? 224 : Math.round(((width / height) * 224) / 4) * 4;
    const resizeHeight = Math.round((height / width) * resizeWidth);
    return (
      <View style={styles.cameraView}>
        {this.renderTopBar()}
        <TensorCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.camera}
          type={this.state.type}
          autoFocus={this.state.autoFocus}
          zoom={this.state.zoom}
          whiteBalance={this.state.whiteBalance}
          ratio={this.state.ratio}
          // Tensor related props
          cameraTextureHeight={textureDims.height}
          cameraTextureWidth={textureDims.width}
          resizeHeight={resizeHeight}
          resizeWidth={resizeWidth}
          resizeDepth={3}
          onReady={this.handleCameraStream}
          autorender
        />
        {this.renderBottomBar()}
      </View>
    );
  };

  renderNoPermissions = () => (
    <View style={styles.noPermissions}>
      <Text style={styles.noPermissionsText}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
      <Button onPress={this.allowCameraPermission} title="Allow camera" color="white" />
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        {this.state.cameraPermissionsGranted
          ? this.renderCamera()
          : this.renderNoPermissions()}
      </View>
    );
  }
}

CameraScreen.propTypes = {
  swiper: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  requestPrediction: PropTypes.func.isRequired,
  supportSet: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  supportSet: state.supportSet,
});

const mapDispatchToProps = (dispatch) => ({
  requestPrediction: (tensor, supportSet, photo) =>
    dispatch(requestPrediction(tensor, supportSet, photo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);
