import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler

model = joblib.load('SVM_model.joblib')
scaler = StandardScaler()

def prepare_data(data):
    # Prepare your data here based on your model's requirements
    # This is a placeholder implementation
    features = data[['Low', 'Open', 'Volume', 'High', 'Close', 'Adjusted Close']].values
    scaled_features = scaler.fit_transform(features)
    return scaled_features

def predict_stock(data):
    prepared_data = prepare_data(data)
    prediction = model.predict(prepared_data)
    # Assuming you want to predict the next 30 days
    return np.array([prediction[-1]] * 30)