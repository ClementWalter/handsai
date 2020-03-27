FROM tensorflow/serving

ENV MODEL_BASE_PATH /models
ENV MODEL_NAME siamese_nets_classifier

COPY models/siamese_nets_classifier /models/siamese_nets_classifier
