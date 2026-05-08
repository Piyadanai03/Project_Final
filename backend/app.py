from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import io
import cv2
import base64
from PIL import Image

# สร้างแอป Flask
app = Flask(__name__)
CORS(app)

# โหลดโมเดล
model = load_model('./Models/test_MobileNetV2_100_64.keras')

# --- ฟังก์ชันช่วยเหลือสำหรับ Grad-CAM ---

def get_last_conv_layer_name(model):
    """ค้นหา Layer สุดท้ายที่เป็น Convolutional Layer อัตโนมัติ"""
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
    raise ValueError("ไม่พบ Convolutional Layer ในโมเดลนี้")

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """สร้าง Heatmap จากโมเดลและภาพที่กำหนด"""
    
    # แก้ไข 1: เอา [] ออกจาก model.inputs
    grad_model = tf.keras.models.Model(
        model.inputs, [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        
        # ป้องกันกรณีที่โมเดลคืนค่า preds หรือ last_conv_layer_output มาเป็น list
        if isinstance(preds, list):
            preds = preds[0]
        if isinstance(last_conv_layer_output, list):
            last_conv_layer_output = last_conv_layer_output[0]
            
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
            
        class_channel = preds[:, pred_index]

    # คำนวณ Gradient ของคลาสที่ทำนายเทียบกับ feature map
    grads = tape.gradient(class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # นำ weight มาคูณกับ feature map
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # Normalize heatmap ให้อยู่ในช่วง 0 ถึง 1
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def overlay_heatmap(img, heatmap, alpha=0.5):
    """นำ Heatmap สีรุ้ง (JET) มาซ้อนทับภาพต้นฉบับ"""
    img_array = np.array(img) # ภาพต้นฉบับ (RGB)
    
    # แปลง heatmap ให้อยู่ในช่วง 0-255 และใส่สี
    heatmap = np.uint8(255 * heatmap)
    jet_heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    
    # แก้ไขตรงนี้: เปลี่ยน COLORMAP_BGR2RGB เป็น COLOR_BGR2RGB
    jet_heatmap = cv2.cvtColor(jet_heatmap, cv2.COLOR_BGR2RGB) 
    
    # ปรับขนาด heatmap ให้เท่ากับภาพต้นฉบับ
    jet_heatmap = cv2.resize(jet_heatmap, (img_array.shape[1], img_array.shape[0]))
    
    # ซ้อนทับภาพ (ภาพเดิม + heatmap)
    superimposed_img = jet_heatmap * alpha + img_array
    superimposed_img = np.clip(superimposed_img, 0, 255).astype('uint8')
    
    return superimposed_img

# ----------------------------------------

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # 1. อ่านไฟล์ภาพและเตรียมข้อมูล (คงเดิม)
        img = Image.open(io.BytesIO(file.read()))
        img = img.resize((224, 224))
        img = img.convert("RGB")
        print("Image loaded and processed successfully")

        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # 2. ทำนายผลลัพธ์ (คงเดิม)
        predictions = model.predict(img_array)
        
        if predictions.shape[1] == 2:  # หากเป็นการจำแนกแบบ 2 คลาส
            class_names = ['Cassava', 'SugarCane']
            percentages = (predictions[0] * 100).round(2)
            predicted_class_idx = np.argmax(predictions, axis=1)[0]
            result = class_names[predicted_class_idx]

            # 3. กระบวนการทำ Grad-CAM Heatmap
            last_conv_layer_name = get_last_conv_layer_name(model)
            heatmap = make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=predicted_class_idx)
            
            # ซ้อนทับ Heatmap ลงบนภาพต้นฉบับ
            cam_image_array = overlay_heatmap(img, heatmap)
            cam_image_pil = Image.fromarray(cam_image_array)

            # แปลงภาพผลลัพธ์เป็น Base64 เพื่อส่งผ่าน JSON
            buffered = io.BytesIO()
            cam_image_pil.save(buffered, format="JPEG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

            # 4. ส่งคืนผลลัพธ์
            return jsonify({
                'result': result,
                'percentages': {
                    class_names[0]: float(percentages[0]),
                    class_names[1]: float(percentages[1])
                },
                'heatmap_image': f"data:image/jpeg;base64,{img_base64}" # ส่งภาพกลับไป
            })
        else:
            return jsonify({'error': 'Unexpected output shape from model'}), 500

    except Exception as e:
        print("Error occurred:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)