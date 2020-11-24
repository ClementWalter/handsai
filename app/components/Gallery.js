import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Gallery from "react-native-photo-browser";
import { StyleSheet, TouchableOpacity, View, YellowBox } from 'react-native'
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import DefaultModalContent from './DefaultModalContent';

YellowBox.ignoreWarnings([ // TODO: Remove when fixed
  'VirtualizedLists should never be nested',
  'Animated: `useNativeDriver` was not specified',
])

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

class GalleryScreen extends React.Component {

  state = {
    cameraRollPermissionsGranted: false,
    isModalVisible: false,
  };

  allowCameraRollPermission = async () => {
    if (!this.state.cameraRollPermissionsGranted) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({cameraRollPermissionsGranted: status === 'granted'});
    }
  }

  componentDidMount = async () => {
    await this.allowCameraRollPermission();
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible})
  }

  saveSupportSet = async () => {
    const assets = await Promise.all(this.props.supportSet.map((prediction) => (MediaLibrary.createAssetAsync(prediction.uri))))
    const labels = this.props.supportSet.map((prediction) => (prediction.label))
    const albums = [...new Set(labels)]
    for (let iLoop = 0; iLoop < albums.length; iLoop++) {
      const albumName = albums[iLoop]
      const albumAssets = assets.filter((asset, iAsset) => labels[iAsset] === albumName)

      let album;
      if (await MediaLibrary.getAlbumAsync(albumName) === null) {
        const asset = albumAssets.shift()
        album = await MediaLibrary.createAlbumAsync(albumName, asset, false)
      } else {
        album = await MediaLibrary.getAlbumAsync(albumName)
      }

      await MediaLibrary.addAssetsToAlbumAsync(albumAssets, album, false)
    }
  }

  onPress = () => {
    this.toggleModal()
    this.saveSupportSet()
  }

  render() {
    const mediaList = this.props.supportSet.map((prediction) => ({
      photo: prediction.uri,
      caption: prediction.label,
    }))
    return (
      <View style={styles.view}>
        <Gallery
          mediaList={mediaList}
          startOnGrid={true}
          displayActionButton={false}
          customBottomBarButton={
            <TouchableOpacity onPress={this.toggleModal}>
              <MaterialCommunityIcons name="dots-horizontal" size={32} color="white"/>
            </TouchableOpacity>}
        />
        <Modal isVisible={this.state.isModalVisible}
               swipeThreshold={10}
               onSwipeComplete={this.toggleModal}
               swipeDirection={["down"]}
               style={styles.modal}
               onBackdropPress={this.toggleModal}
        >
          <DefaultModalContent onPress={this.onPress} text="Save support set to camera roll"/>
        </Modal>
      </View>
    );
  }
}

GalleryScreen.propTypes = {
  supportSet: PropTypes.array,
}

const mapStateToProps = (state) => ({
    supportSet: state.supportSet,
  })
;

export default connect(mapStateToProps, null)(GalleryScreen)
