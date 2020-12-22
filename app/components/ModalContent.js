import React from "react";
import { Button, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});

const ModalContent = (props) => (
  <View style={styles.content}>
    <Button onPress={props.onPress} title={props.text} />
  </View>
);

ModalContent.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default ModalContent;
