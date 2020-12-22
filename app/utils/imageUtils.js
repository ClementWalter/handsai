import * as ImageManipulator from "expo-image-manipulator";

export const resizeWithPad = (width, height, options = {}) => async (photo) => {
  const resize = photo.width < photo.height ? { height } : { width };
  return ImageManipulator.manipulateAsync(photo.uri, [{ resize }], {
    ...{ format: ImageManipulator.SaveFormat.JPEG, base64: true },
    ...options,
  });
};

export const cropBoundingBox = async (uri, boundingBox) => {
  const crop = {
    originX: boundingBox.x1,
    originY: boundingBox.y1,
    width: boundingBox.x2 - boundingBox.x1,
    height: boundingBox.y2 - boundingBox.y1,
  };
  return ImageManipulator.manipulateAsync(uri, [{ crop }], {
    format: ImageManipulator.SaveFormat.JPEG,
  });
};

export const base64WebSafe = (base64) =>
  base64
    .replace(/(?:\r\n|\r|\n)/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .split(",")
    .pop();
