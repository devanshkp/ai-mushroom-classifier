from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "https://ai-mushroom-classifier-r2ed.vercel.app"])

# Class names imported from json file
with open('class_names.json', 'r') as f:
    class_names = json.load(f)

# Loading Model
model = tf.keras.models.load_model('model/mushroom.keras')

CONFIDENCE_THRESHOLD = 0.5   # MINIMUM ACCURACY TO GIVE OUT A CONFIDENT RESULT


# Helper function to preprocess uplaoded image before model prediction
def preprocess_image(image_bytes, target_size=(224, 224)):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

@app.route('/predict', methods=['POST', 'OPTIONS'])  # Add OPTIONS for preflight requests
@cross_origin()  # Enable CORS for this specific route
def predict():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not file.content_type.startswith('image/'):
        return jsonify({'error': 'Uploaded file is not an image'}), 400

    try:
        # Log incoming request for debugging
        print(f"Received file: {file.filename}, Content-Type: {file.content_type}")
        
        image_bytes = file.read()
        preprocessed = preprocess_image(image_bytes)
        preds = model.predict(preprocessed)

        top_index = np.argmax(preds[0])
        top_confidence = preds[0][top_index]

        # Get top 3 predictions
        top_3_indices = preds[0].argsort()[-3:][::-1]
        top_3 = [{
            'label': class_names[i],
            'confidence': round(float(preds[0][i]), 4),
            'warning': 'Low confidence - might not be a mushroom or unclear image' if preds[0][i] < CONFIDENCE_THRESHOLD else None,
        } for i in top_3_indices]
        
        response = {'predictions': top_3}
        
        # Log response for debugging
        print(f"Sending response: {response}")
        
        return jsonify(response)

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Add a simple health check endpoint
@app.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Mushroom classifier API is running'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)