import { AppLoading } from "expo";
import * as Icon from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import Swiper from "react-native-swiper";
import React from "react";
import { StyleSheet, View } from "react-native";
import * as tf from "@tensorflow/tfjs";
import { Provider } from "react-redux";
import HomeScreen from "./components/HomeScreen";
import Gallery from "./components/Gallery";

import store from "./store/store";
import preprocessing from "./models/preprocessing";
import encoder from "./models/encoder";
import kernel from "./models/kernel";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
    };
  }

  scrollBy = (i) => () => {
    this.swiper.scrollBy(i, true);
  };

  loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([
        require("./assets/images/splash.png"),
        require("./assets/images/icon.png"),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.MaterialIcons.font,
        ...Icon.MaterialCommunityIcons.font,
        ...Icon.FontAwesome.font,
        ...Icon.Feather.font,
        ...Icon.EvilIcons.font,
        ...Icon.Ionicons.font,
      }),
      tf.ready(),
    ]);
    await Promise.all([
      preprocessing.loadModel(),
      encoder.loadModel(),
      kernel.loadModel(),
    ]);
  };

  handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }
    return (
      <Provider store={store}>
        <Swiper
          loop={false}
          showsPagination={false}
          ref={(swiper) => {
            this.swiper = swiper;
          }}
        >
          <View style={styles.container}>
            <HomeScreen swiper={this.scrollBy(1)} />
          </View>
          <View style={styles.container}>
            <Gallery swiper={this.scrollBy(-1)} />
          </View>
        </Swiper>
      </Provider>
    );
  }
}
