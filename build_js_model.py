import tensorflowjs as tfjs
import tensorflow as tf
from tensorflow.keras.models import load_model

model = load_model("models/siamese_nets_classifier/1")

#%% Extract preprocessing, encoder and support layer
tfjs.converters.convert_tf_saved_model(
    "models/siamese_nets_classifier/1",
    "models/preprocessing/graph",
    weight_shard_size_bytes=1024 * 1024 * 4 * 4,
    signature_def="preprocessing",
    skip_op_check=True,
)

encoder = model.layers[0]
tf.saved_model.save(encoder, "models/encoder/saved_model/1")
tfjs.converters.convert_tf_saved_model(
    "models/encoder/saved_model/1", "models/encoder/graph", weight_shard_size_bytes=1024 * 1024 * 4 * 4
)

kernel = model.layers[1].kernel
tf.saved_model.save(kernel, "models/kernel/saved_model/1")
tfjs.converters.convert_tf_saved_model("models/kernel/saved_model/1", "models/kernel/graph")
