from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
import os
import shutil
from werkzeug.utils import secure_filename
import zipfile

app = Flask(__name__)
CORS(app)
upload_dir = 'uploads'

# Crear el directorio de uploads si no existe
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir)

@app.route('/')
def index():
    return render_template('index.html')
if __name__ == '__main__':
    app.run(port=8002)