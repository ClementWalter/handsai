import { AppLoading } from 'expo'
import * as Icon from '@expo/vector-icons';
import { Asset } from 'expo-asset'
import * as Font from 'expo-font';
import Swiper from 'react-native-swiper'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import HomeScreen from './components/HomeScreen';
import Gallery from './components/Gallery';
import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-react-native"

import { Provider } from 'react-redux';

import { store } from './store/store';
import encoder from './models/encoder'
import kernel from './models/kernel';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      return (
        <Provider store={store}>
          <Swiper loop={false} showsPagination={false}>
            <View style={styles.container}>
              <HomeScreen/>
            </View>
            <View style={styles.container}>
              <Gallery/>
            </View>
          </Swiper>
        </Provider>
      )
    }
  }

  _loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([
        require('./assets/images/splash.png'),
        require('./assets/images/icon.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.MaterialIcons.font,
        ...Icon.FontAwesome.font,
        ...Icon.Feather.font,
      }),
      tf.ready(),
    ])
    await Promise.all([
      encoder.loadModel(),
      kernel.loadModel(),
    ])
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  };

  _handleFinishLoading = () => {
    this.setState({isLoadingComplete: true})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6E00FF',
  },
});
