import { AppLoading } from 'expo'
import * as Icon from '@expo/vector-icons';
import { Asset } from 'expo-asset'
import * as Font from 'expo-font';
import Swiper from 'react-native-swiper'
import React from 'react'
import { Button, StyleSheet, View } from 'react-native'
import HomeScreen from './components/HomeScreen';
import Gallery from './components/Gallery';

import { Provider } from 'react-redux';

import { store } from './store/store';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
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
    return Promise.all([
      Asset.loadAsync([
        require('./assets/splash.png'),
        require('./assets/icon.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.MaterialIcons.font,
        ...Icon.MaterialCommunityIcons.font,
        ...Icon.FontAwesome.font,
        ...Icon.Feather.font,
      }),
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
