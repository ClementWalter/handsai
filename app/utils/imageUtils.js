import * as ImageManipulator from "expo-image-manipulator";

export const resize = (width, height) => async (photo) => {
  const resize = photo.width < photo.height ? {height} : {width};
  return ImageManipulator.manipulateAsync(
    photo.uri,
    [{resize}],
    {compress: 0.1, format: ImageManipulator.SaveFormat.JPEG, base64: true},
  );
};

export const crop = async (uri, boundingBox) => {
  const crop = {
    originX: boundingBox.x1,
    originY: boundingBox.y1,
    width: boundingBox.x2 - boundingBox.x1,
    height: boundingBox.y2 - boundingBox.y1,
  }
  return ImageManipulator.manipulateAsync(
    uri,
    [{crop}],
    {format: ImageManipulator.SaveFormat.JPEG},
  );
};

export const base64WebSafe = (base64) => base64.replace(/(?:\r\n|\r|\n)/g, '').replace(/\+/g, '-').replace(/\//g, '_').split(',').pop();
