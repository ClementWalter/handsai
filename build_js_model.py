import tensorflowjs as tfjs
import tensorflow as tf
from tensorflow.keras.models import load_model

model = load_model("serving/models/siamese_nets_classifier/1")

#%% Extract encoder and support layer
encoder = model.layers[0]
tf.saved_model.save(encoder, "models/encoder/saved_model/1")
tfjs.converters.convert_tf_saved_model(
    "models/encoder/saved_model/1", "models/encoder/graph", weight_shard_size_bytes=1024 * 1024 * 4 * 4
)

kernel = model.layers[1].kernel
tf.saved_model.save(kernel, "models/kernel/saved_model/1")
tfjs.converters.convert_tf_saved_model("models/kernel/saved_model/1", "models/kernel/graph")

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
