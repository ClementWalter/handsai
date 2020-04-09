import tensorflowjs as tfjs
import tensorflow as tf
from tensorflow.keras.models import load_model

model = load_model("../Keras-FewShotLearning/siamese_nets_classifier/1")

#%% Create fake catalog
support_set_size = 1
image_bytes = tf.convert_to_tensor(
    [
        tf.io.encode_base64(
            tf.io.encode_jpeg(tf.cast(tf.random.uniform((350, 250, 3), minval=0, maxval=255), dtype=tf.uint8))
        )
        for _ in range(support_set_size)
    ]
)

label = tf.convert_to_tensor(["NO_LABEL"])
crop_window = tf.convert_to_tensor([[0, 0, 200, 224]])
model.signatures["set_support_set"](
    image_bytes=image_bytes, crop_window=crop_window, label=label, overwrite=tf.constant(True),
)

tf.saved_model.save(model, "handsai/web-model", signatures={"serving_default": model.signatures["serving_default"]})

#%% Export js model
tfjs.converters.convert_tf_saved_model("handsai/web-model", "handsai/web-model", skip_op_check=True)
