import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Prediction from './Prediction';

import Camera from './Camera';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    margin: 0,
  },
})

class Home extends React.Component {
  state = {
    uri: null,
  }

  handleTakePictureAsync = (photo) => {
    this.setState({uri: photo.uri})
  }
  onSwipeComplete = () => this.setState({uri: null});

  render() {
    return (
      <View style={styles.container}>
        <Camera handleTakePictureAsync={this.handleTakePictureAsync}/>
        <Modal isVisible={!!this.state.uri}
               onSwipeComplete={this.onSwipeComplete}
               style={styles.modal}
               backdropOpacity={1}
               swipeDirection="up"
        >
          {this.state.uri ? <Prediction uri={this.state.uri}/> : <View/>}
        </Modal>
      </View>
    )
  }
}

export default Home
