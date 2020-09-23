import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Gallery from "react-native-photo-browser";
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([ // TODO: Remove when fixed
  'VirtualizedLists should never be nested',
  'Animated: `useNativeDriver` was not specified',
])

class GalleryScreen extends React.Component {

  render() {
    const mediaList = Object.values(this.props.supportSet).map((prediction) => ({
      photo: prediction.photo.uri,
      caption: prediction.label,
    }))
    return (
      <Gallery mediaList={mediaList} startOnGrid={true}/>
    );
  }
}

GalleryScreen.propTypes = {
  supportSet: PropTypes.object,
}

const mapStateToProps = (state) => ({
    supportSet: state.supportSet,
  })
;

export default connect(mapStateToProps, null)(GalleryScreen)
