import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

export const loadBase64 = (base64) => {
  const imgBuffer = tf.util.encodeString(base64, 'base64').buffer;
  const raw = new Uint8Array(imgBuffer)
  return decodeJpeg(raw);
}

export const loadUri = async (uri) => {
  const imgB64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return loadBase64(imgB64)
}

export const padToSquare = (tensor) => {
  const [height, width] = tensor.shape;
  const padHeight = width > height ? width - height : 0;
  const padWidth = height > width ? height - width : 0;
  return tensor.pad([[0, padHeight], [0, padWidth], [0, 0]])
}
