import * as tf from "@tensorflow/tfjs";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";
import * as jpeg from "jpeg-js";

export const loadBase64 = (base64) => {
  const imgBuffer = tf.util.encodeString(base64, "base64").buffer;
  const raw = new Uint8Array(imgBuffer);
  return decodeJpeg(raw);
};

export const loadUri = async (uri) => {
  const imgB64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return loadBase64(imgB64);
};

export const padToSquare = (tensor) => {
  const [height, width] = tensor.shape;
  const padHeight = width > height ? width - height : 0;
  const padWidth = height > width ? height - width : 0;
  return tensor.pad([
    [0, padHeight],
    [0, padWidth],
    [0, 0],
  ]);
};

export const tensor2Buffer = (tensor) => {
  const height = tensor.shape[0];
  const width = tensor.shape[1];
  const data = Buffer.from(
    // concat with an extra alpha channel and slice up to 4 channels to handle 3 and 4 channels tensors
    tf
      .concat([tensor, tf.ones([height, width, 1]).mul(255)], -1)
      .slice([0], [height, width, 4])
      .dataSync()
  );

  return { data, width, height };
};

export const encodeJpeg = async (tensor) => {
  const rawImageData = tensor2Buffer(tensor);
  const jpegImageData = jpeg.encode(rawImageData, 100);

  const imgBase64 = tf.util.decodeString(jpegImageData.data, "base64");
  const salt = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const uri = `${FileSystem.documentDirectory}tensor-${salt}.jpg`;
  await FileSystem.writeAsStringAsync(uri, imgBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return { uri, width: rawImageData.width, height: rawImageData.height };
};

export const compressJpeg = async (tensor, quality) => {
  const rawImageData = tensor2Buffer(tensor);
  const jpegImageData = jpeg.encode(rawImageData, quality);
  const { width, height, data } = jpeg.decode(jpegImageData.data, {
    useTArray: true,
  });
  return tf.tensor(data, [height, width, 4]).slice([0], [height, width, tensor.shape[2]]);
};
