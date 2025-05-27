from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import os

app = Flask(__name__)

try:
    model_path = 'model/mushroom.keras'
    class_names_path = 'class_names.json'

    if not os.path.exists(model_path) or not os.path.exists(class_names_path):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(current_dir) 
        model_path = os.path.join(backend_dir, 'model', 'mushroom.keras')
        class_names_path = os.path.join(backend_dir, 'class_names.json')

    with open(class_names_path, 'r') as f:
        class_names = json.load(f)

    model = tf.keras.models.load_model(model_path)
    print(f"Model loaded from: {model_path}")
    print(f"Class names loaded from: {class_names_path}")


except Exception as e:
    print(f"CRITICAL ERROR loading model or class_names: {e}")
    print(f"Attempted model path: {model_path if 'model_load_path' in locals() else 'not defined'}")
    print(f"Attempted class_names path: {class_names_path if 'class_names_load_path' in locals() else 'not defined'}")
    class_names = []
    model = None

CONFIDENCE_THRESHOLD = 0.5   # MINIMUM ACCURACY TO GIVE OUT A CONFIDENT RESULT

# Helper function to preprocess uplaoded image before model prediction
def preprocess_image(image_bytes, target_size=(224, 224)):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

@app.route('/predict', methods=['POST']) 
def predict():
    if model is None or not class_names:
        return jsonify({'error': 'Model not loaded or class names missing on server.'}), 500
    
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
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Mushroom classifier API is running'})

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)