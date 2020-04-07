import os
import requests
from flask import Flask, request, send_from_directory
from flask_cors import CORS


app = Flask(__name__, static_folder="handsai/web-build")
CORS(app)


# Serve React App
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.route("/status")
def status():
    return requests.get("http://serving:8501/v1/models/siamese_nets_classifier").content


@app.route("/predict", methods=["POST"])
def predict():
    return requests.post("http://serving:8501/v1/models/siamese_nets_classifier:predict", json=request.json).content
