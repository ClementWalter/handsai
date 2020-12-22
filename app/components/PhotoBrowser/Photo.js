import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  thumbnailSelectionIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  fullScreenSelectionIcon: {
    position: "absolute",
    top: 60,
    right: 16,
  },
});

export default class Photo extends Component {
  constructor(props) {
    super(props);

    const { uri } = props;

    this.state = {
      uri,
      progress: 0,
    };
  }

  onProgress = (event) => {
    const progress = event.nativeEvent.loaded / event.nativeEvent.total;
    if (!this.props.thumbnail && progress !== this.state.progress) {
      this.setState({
        progress,
      });
    }
  };

  onError = () => {
    this.setState({ progress: 1 });
  };

  onLoad = () => {
    this.setState({ progress: 1 });
  };

  render() {
    const { resizeMode, width, height } = this.props;
    const screen = Dimensions.get("window");
    const { uri } = this.state;

    let source;
    if (uri) {
      // create source objects for http/asset strings
      // or directly pass uri number for local files
      source = typeof uri === "string" ? { uri } : uri;
    }

    // i had to get window size and set photo size here
    // to be able to respond device orientation changes in full screen mode
    // FIX_ME: when you have a better option
    const sizeStyle = {
      width: width || screen.width,
      height: height || screen.height,
    };

    return (
      <View style={[styles.container, sizeStyle]}>
        <Image
          style={[styles.image, sizeStyle]}
          source={source}
          onProgress={this.onProgress}
          onError={this.onError}
          onLoad={this.onLoad}
          resizeMode={resizeMode}
        />
      </View>
    );
  }
}

Photo.propTypes = {
  uri: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  resizeMode: PropTypes.string,
  thumbnail: PropTypes.bool,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

Photo.defaultProps = {
  resizeMode: "contain",
  thumbnail: false,
};
