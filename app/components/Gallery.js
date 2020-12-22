import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PhotoBrowser from "./PhotoBrowser";
import { Alert, StyleSheet, View } from 'react-native'
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import Modal from 'react-native-modal';
import ModalContent from './ModalContent';
import { clearSupportSet } from '../actions/supportSetActions';
import { requestMediaPrediction } from '../actions/predictionActions'
import * as ImageManipulator from 'expo-image-manipulator';

const styles = StyleSheet.create({
  container: {
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
    if ( !this.state.cameraRollPermissionsGranted ) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({cameraRollPermissionsGranted: status === 'granted'});
    }
  }

  componentDidMount = async () => {
    await this.allowCameraRollPermission();
  };

  toggleModal = () => (
    this.setState({isModalVisible: !this.state.isModalVisible})
  )

  saveSupportSet = async () => {
    const assets = await Promise.all(this.props.supportSet.map((prediction) => (
      MediaLibrary.createAssetAsync(prediction.uri)
    )))
    const labels = this.props.supportSet.map((prediction) => (
      prediction.label
    ))
    const albums = [...new Set(labels)]
    for ( let iLoop = 0; iLoop < albums.length; iLoop++ ) {
      const albumName = albums[iLoop]
      const albumAssets = assets.filter((asset, iAsset) => labels[iAsset] === albumName)

      let album;
      if ( await MediaLibrary.getAlbumAsync(albumName) === null ) {
        const asset = albumAssets.shift()
        album = await MediaLibrary.createAlbumAsync(albumName, asset, false)
      }
      else {
        album = await MediaLibrary.getAlbumAsync(albumName)
      }

      await MediaLibrary.addAssetsToAlbumAsync(albumAssets, album, false)
    }
  }

  alertNoAlbum = () => Alert.alert(
    "No media found in albums",
    "You may want to add them from your camera roll app",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ],
    {cancelable: false},
  );

  loadSupportSet = async () => {
    const albums = await MediaLibrary.getAlbumsAsync()
    const albumsAssets = await Promise.all(albums.map((album) => MediaLibrary.getAssetsAsync({album})))
    const media = albumsAssets.map((albumAssets, index) => albumAssets.assets.map((x) => (
      {
        ...x,
        label: albums[index].title,
      }
    ))).flat()
    if ( media.length === 0 ) {
      await this.alertNoAlbum()
    }
    else {
    this.toggleModal()
      const assetInfos = await Promise.all(
        media.map((asset) => MediaLibrary.getAssetInfoAsync(asset)),
      )
      const jpegs = await Promise.all(
        assetInfos.map((asset) => ImageManipulator.manipulateAsync(asset.localUri, [{resize: {width: 224}}], {compress: 0.1})),
      )
      const mediaWithInfo = media.map((asset, index) => (
        {...asset, ...jpegs[index]}
      ))
      await this.props.requestMediaPrediction(mediaWithInfo)
    }
  }

  clearSupportSet = () => {
    this.toggleModal()
    this.props.clearSupportSet()
  }

  onPress = async () => {
    this.toggleModal()
    await this.saveSupportSet()
  }

  render() {
    const mediaList = this.props.supportSet.map((prediction) => (
      {
        photo: prediction.uri,
        caption: prediction.label,
      }
    ))
    return (
      <View style={styles.container}>
        <PhotoBrowser
          onBack={this.props.swiper}
          mediaList={mediaList}
          startOnGrid={true}
          displayActionButton={false}
          toggleModal={this.toggleModal}
        />
        <Modal isVisible={this.state.isModalVisible}
               swipeThreshold={10}
               onSwipeComplete={this.toggleModal}
               swipeDirection={["down"]}
               style={styles.modal}
               onBackdropPress={this.toggleModal}
        >
          <ModalContent onPress={this.onPress} text="Save to camera roll"/>
          <ModalContent onPress={this.loadSupportSet} text="Load from camera roll"/>
          <ModalContent onPress={this.clearSupportSet} text="Clear"/>
        </Modal>
      </View>
    );
  }
}

GalleryScreen.propTypes = {
  supportSet: PropTypes.array,
}

const mapStateToProps = (state) => (
    {
      supportSet: state.supportSet,
    }
  )
;

const mapDispatchToProps = (dispatch) => (
  {
    requestMediaPrediction: (media) => dispatch(requestMediaPrediction(media)),
    clearSupportSet: () => dispatch(clearSupportSet()),
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(GalleryScreen)
