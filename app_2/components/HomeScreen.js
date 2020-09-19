import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import Prediction from './Prediction';
import isEmpty from 'lodash/isEmpty';
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
    photo: null,
  }

  handleTakePictureAsync = (photo) => this.setState({ photo })

  onSwipeComplete = () => this.setState({photo: null});

  render() {
    return (
      <View style={styles.container}>
        <Camera handleTakePictureAsync={this.handleTakePictureAsync}/>
        <Modal isVisible={!isEmpty(this.state.photo)}
               onSwipeComplete={this.onSwipeComplete}
               style={styles.modal}
               backdropOpacity={1}
               swipeDirection="up"
        >
          {!isEmpty(this.state.photo) ? <Prediction photo={this.state.photo}/> : <View/>}
        </Modal>
      </View>
    )
  }
}

export default Home
