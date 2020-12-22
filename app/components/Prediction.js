import React from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { connect } from "react-redux";
import { ProgressBar } from "react-native-paper";
import { savePrediction, updatePrediction } from "../actions/predictionActions";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#000000",
  },
  imageStyle: {
    resizeMode: "contain",
  },
  topBar: {
    flex: 0.2,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  loader: { flex: 1, flexDirection: "column", justifyContent: "center" },
  labelBar: {
    flex: 0.8,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    width,
  },
  labelText: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    color: "black",
  },
  confidenceContainer: {
    flex: 0.2,
    flexDirection: "column",
    justifyContent: "flex-start",
    width,
  },
  progressBar: { width, height: 10, backgroundColor: "transparent" },
  bottomBar: {
    backgroundColor: "transparent",
    justifyContent: "space-around",
    flex: 0.2,
    flexDirection: "row",
  },
  noPermissions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  labelOk: { color: "rgb(84,255,34)" },
  labelKo: { color: "#c3483c" },
});

class Prediction extends React.Component {
  onLabelReject = () => this.labelInput.focus();

  onLabelAccept = () => {
    this.props.savePrediction(this.props.prediction);
    this.props.toggleModal();
  };

  renderTopBar = (label, confidence) => (
    <View style={styles.topBar}>
      {typeof label === "string" && this.renderLabel(label)}
      {this.renderConfidence(confidence)}
    </View>
  );

  onLabelChange = (label) => this.props.updatePrediction(label);

  renderLabel = (label) => (
    <View style={styles.labelBar}>
      <TextInput
        value={label}
        onChangeText={this.onLabelChange}
        selectTextOnFocus
        style={styles.labelText}
        ref={(ref) => {
          this.labelInput = ref;
        }}
      />
    </View>
  );

  renderConfidence = (confidence) => {
    let backgroundColor;
    if (confidence < 0.5) {
      backgroundColor = "red";
    } else if (confidence < 0.75) {
      backgroundColor = "yellow";
    } else {
      backgroundColor = "green";
    }
    return (
      <View style={styles.confidenceContainer}>
        <ProgressBar
          style={styles.progressBar}
          progress={confidence}
          color={backgroundColor}
        />
      </View>
    );
  };

  renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={this.onLabelReject} style={{ alignSelf: "center" }}>
        <FontAwesome name="times-circle" size={60} style={styles.labelKo} />
      </TouchableOpacity>
      <TouchableOpacity onPress={this.onLabelAccept} style={{ alignSelf: "center" }}>
        <FontAwesome name="check-circle" size={60} style={styles.labelOk} />
      </TouchableOpacity>
    </View>
  );

  render() {
    const { predictions } = { ...this.props.prediction };
    const label = !!predictions && predictions[0].label;
    const confidence = (!!predictions && predictions[0].confidence) || 0;
    const uri = !!predictions && predictions[0].uri;
    const source = uri ? { uri } : require("../assets/images/splash.png");
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={styles.background}
          imageStyle={styles.imageStyle}
          source={source}
        >
          {this.renderTopBar(label, confidence)}
          {predictions ? (
            this.renderBottomBar()
          ) : (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
        </ImageBackground>
      </View>
    );
  }
}

Prediction.propTypes = {
  prediction: PropTypes.shape({
    predictions: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  toggleModal: PropTypes.func.isRequired,
  savePrediction: PropTypes.func.isRequired,
  updatePrediction: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  prediction: state.prediction,
});

const mapDispatchToProps = (dispatch) => ({
  updatePrediction: (label) => dispatch(updatePrediction(label)),
  savePrediction: (prediction) => dispatch(savePrediction(prediction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Prediction);
