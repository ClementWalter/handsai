import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import Blueprint, Flask, redirect, request, send_from_directory, url_for
from flask_cors import CORS
from flask_httpauth import HTTPTokenAuth

app = Flask(__name__, static_folder="web/build")
api = Blueprint("api", __name__, url_prefix="/api")

auth = HTTPTokenAuth(scheme="Bearer")
CORS(app)


@auth.verify_token
def verify_token(token):
    return token == app.config["TOKEN"]


# Serve React App
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
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


@api.route("/models/<path:path>")
@auth.login_required
def models(path):
    return send_from_directory("models", path)


app.register_blueprint(api)

if app.env == "production":
    app.config.from_object("config.Config")
if app.env == "development":
    app.config.from_object("config.DevelopmentConfig")

if __name__ == "__main__":
    app.run(host="0.0.0.0")
