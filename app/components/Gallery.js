import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Alert, StyleSheet, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import Modal from "react-native-modal";
import * as ImageManipulator from "expo-image-manipulator";
import ModalContent from "./ModalContent";
import { clearSupportSet } from "../actions/supportSetActions";
import { requestMediaPrediction } from "../actions/predictionActions";
import PhotoBrowser from "./PhotoBrowser";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
});

class GalleryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraRollPermissionsGranted: false,
      isModalVisible: false,
    };
  }

  allowCameraRollPermission = async () => {
    if (!this.state.cameraRollPermissionsGranted) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ cameraRollPermissionsGranted: status === "granted" });
    }
  };

  componentDidMount = async () => {
    await this.allowCameraRollPermission();
  };

  toggleModal = () =>
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));

  saveSupportSet = async () => {
    const assets = await Promise.all(
      this.props.supportSet.map((prediction) =>
        MediaLibrary.createAssetAsync(prediction.uri)
      )
    );
    const assetsByAlbum = assets.reduce((previousValue, currentValue, index) => {
      const newValue = {
        [this.props.supportSet[index].label]: [],
        ...previousValue,
      };
      newValue[this.props.supportSet[index].label].push(currentValue);
      return newValue;
    }, {});
    // noinspection JSCheckFunctionSignatures
    const labels = Object.keys(assetsByAlbum);
    let albums = await Promise.all(labels.map(MediaLibrary.getAlbumAsync));
    albums = await Promise.all(
      albums.map((album, index) => {
        if (album === null) {
          const asset = assetsByAlbum[labels[index]].shift();
          return MediaLibrary.createAlbumAsync(labels[index], asset, false);
        }
        return album;
      })
    );
    // noinspection JSCheckFunctionSignatures
    await Promise.all(
      Object.values(assetsByAlbum).map((albumAssets, index) =>
        MediaLibrary.addAssetsToAlbumAsync(albumAssets, albums[index], false)
      )
    );
  };

  alertNoAlbum = () =>
    Alert.alert(
      "No media found in albums",
      "You may want to add them from your camera roll app",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );

  loadSupportSet = async () => {
    const albums = await MediaLibrary.getAlbumsAsync();
    const albumsAssets = await Promise.all(
      albums.map((album) => MediaLibrary.getAssetsAsync({ album }))
    );
    const media = albumsAssets
      .map((albumAssets, index) =>
        albumAssets.assets.map((x) => ({
          ...x,
          label: albums[index].title,
        }))
      )
      .flat();
    if (media.length === 0) {
      await this.alertNoAlbum();
    } else {
      this.toggleModal();
      const assetInfos = await Promise.all(
        media.map((asset) => MediaLibrary.getAssetInfoAsync(asset))
      );
      const jpegs = await Promise.all(
        assetInfos.map((asset) =>
          ImageManipulator.manipulateAsync(asset.localUri, [{ resize: { width: 224 } }], {
            compress: 0.1,
          })
        )
      );
      const mediaWithInfo = media.map((asset, index) => ({
        ...asset,
        ...jpegs[index],
      }));
      await this.props.requestMediaPrediction(mediaWithInfo);
    }
  };

  clearSupportSet = () => {
    this.toggleModal();
    this.props.clearSupportSet();
  };

  onPress = async () => {
    this.toggleModal();
    await this.saveSupportSet();
  };

  render() {
    const mediaList = this.props.supportSet.map((prediction) => ({
      photo: prediction.uri,
      caption: prediction.label,
    }));
    return (
      <View style={styles.container}>
        <PhotoBrowser
          onBack={this.props.swiper}
          mediaList={mediaList}
          startOnGrid
          displayActionButton={false}
          toggleModal={this.toggleModal}
        />
        <Modal
          isVisible={this.state.isModalVisible}
          swipeThreshold={10}
          onSwipeComplete={this.toggleModal}
          swipeDirection={["down"]}
          style={styles.modal}
          onBackdropPress={this.toggleModal}
        >
          <ModalContent onPress={this.onPress} text="Save to camera roll" />
          <ModalContent onPress={this.loadSupportSet} text="Load from camera roll" />
          <ModalContent onPress={this.clearSupportSet} text="Clear" />
        </Modal>
      </View>
    );
  }
}

GalleryScreen.propTypes = {
  supportSet: PropTypes.arrayOf(PropTypes.object).isRequired,
  requestMediaPrediction: PropTypes.func.isRequired,
  clearSupportSet: PropTypes.func.isRequired,
  swiper: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  supportSet: state.supportSet,
});
const mapDispatchToProps = (dispatch) => ({
  requestMediaPrediction: (media) => dispatch(requestMediaPrediction(media)),
  clearSupportSet: () => dispatch(clearSupportSet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(GalleryScreen);
