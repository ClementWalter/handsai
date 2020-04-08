import os
import requests
from flask import Flask, request, send_from_directory, Response
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
    response = requests.get("http://handsai-serving.herokuapp.com/v1/models/siamese_nets_classifier")
    return Response(response.text, status=response.status_code, content_type=response.headers["content-type"])


@app.route("/predict", methods=["POST"])
def predict():
    response = requests.post(
        "http://handsai-serving.herokuapp.com/v1/models/siamese_nets_classifier:predict", json=request.json
    )
    return Response(response.text, status=response.status_code, content_type=response.headers["content-type"])


if __name__ == "__main__":
    app.run(host="0.0.0.0")
