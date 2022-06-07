import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import * as tf from "@tensorflow/tfjs";

class Mobilenet extends Component {
  state = {
    value: 0,
    prediction: null,
  };

  buildModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    // Generate some synthetic data for training.
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

    // Train the model using the data.
    model.fit(xs, ys, { epochs: 10 }).then(() => {
      // Use the model to do inference on a data point the model hasn't seen before:
      model.predict(tf.tensor2d([this.value], [1, 1])).print();
      // Open the browser devtools to see the output
    });
  };

  render() {
    const { color, text } = this.props;
    // this.buildModel();

    return (
      <View style={styles.wrapper}>
        {/*<TextInput*/}
        {/*  value={this.value}*/}
        {/*  onChangeText={(value) => this.setState({ value })}*/}
        {/*/>*/}
        <Text style={{ color }}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Mobilenet;
