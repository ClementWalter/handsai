import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests
from flask import Blueprint, Flask, Response, redirect, request, send_from_directory, url_for
from flask_cors import CORS

app = Flask(__name__, static_folder="web/build")
api = Blueprint("api", __name__, url_prefix="/api")

CORS(app)


# Serve React App
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    elif path != "" and os.path.exists("models" + "/" + path):
        return send_from_directory("models", path)
    else:
        return send_from_directory(app.static_folder, "index.html")


# Define api
@api.route("/contact", methods=["POST"])
def contact():
    data = request.form
    contact_password = os.environ["PASSWORD"]
    contact_address = os.environ["CONTACT"]
    message = MIMEMultipart()
    message["From"] = contact_address
    message["To"] = contact_address
    message["Reply-to"] = data.get("email")
    message["Subject"] = data.get("subject")
    message.attach(MIMEText(data.get("message"), "plain"))
    session = smtplib.SMTP("mail.gandi.net", 587)
    session.starttls()
    session.login(contact_address, contact_password)
    text = message.as_string()
    session.sendmail(data.get("email"), contact_address, text)
    session.quit()
    return redirect(url_for("index"))


app.register_blueprint(api)


# Wrap tensorflow api
@app.route("/status")
def status():
    response = requests.get(f"{app.config['SERVING_URI']}/v1/models/siamese_nets_classifier")
    return Response(response.text, status=response.status_code, content_type=response.headers["content-type"])


@app.route("/predict", methods=["POST"])
def predict():
    response = requests.post(
        f"{app.config['SERVING_URI']}/v1/models/siamese_nets_classifier:predict", json=request.json
    )
    return Response(response.text, status=response.status_code, content_type=response.headers["content-type"])


if app.env == "production":
    app.config.from_object("config.Config")
if app.env == "development":
    app.config.from_object("config.DevelopmentConfig")

if __name__ == "__main__":
    app.run(host="0.0.0.0")
