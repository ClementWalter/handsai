import React from 'react';
import * as ExpoPixi from 'expo-pixi'
import { PIXI } from 'expo-pixi'
import '@expo/browser-polyfill';

import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class BoundingBoxDraw extends React.Component {

  onChange = async () => {
    const boundingBox = this.computeBoundingBox();
    const points = this.boundingBoxToPoints(boundingBox);
    this.drawRect(points)
    this.sketch.renderer._update();
    this.props.handleBoundingBoxChange(boundingBox)
  };

  drawRect = (points) => {
    this.sketch.stage.removeChildren();
    const graphics = new PIXI.Graphics();
    this.sketch.stage.addChild(graphics);
    graphics.clear();
    for (let i = 0; i < points.length; i++) {
      const {x, y, color, width, alpha} = points[i];
      if (i === 0) {
        graphics.lineStyle(width, color, alpha);
        graphics.moveTo(x, y);
      } else {
        graphics.lineTo(x, y);
      }
    }
    graphics.endFill();
  }

  computeBoundingBox = () => {
    const x_coordinates = this.sketch.points.map((point) => point.x)
    const y_coordinates = this.sketch.points.map((point) => point.y)
    return {
      x1: x_coordinates.reduce((x, prev) => x < prev ? x : prev),
      x2: x_coordinates.reduce((x, prev) => x > prev ? x : prev),
      y1: y_coordinates.reduce((y, prev) => y < prev ? y : prev),
      y2: y_coordinates.reduce((y, prev) => y > prev ? y : prev),
    }
  }

  boundingBoxToPoints = (boundingBox) => {
    const {x1, y1, x2, y2} = boundingBox
    return [
      {x: x1, y: y1, color: "black", width: 10, alpha: 1},
      {x: x1, y: y2, color: "black", width: 10, alpha: 1},
      {x: x2, y: y2, color: "black", width: 10, alpha: 1},
      {x: x2, y: y1, color: "black", width: 10, alpha: 1},
      {x: x1, y: y1, color: "black", width: 10, alpha: 1},
    ]
  }

  render() {
    return <ExpoPixi.Sketch
      strokeColor="black"
      strokeWidth={10}
      strokeAlpha={1}
      ref={ref => (this.sketch = ref)}
      onChange={this.onChange}
      transparent={true}
      style={{flex: 1, height, width, ...this.props.style}}
    />
  }

}
