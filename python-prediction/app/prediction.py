import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR
from pandas.tseries.offsets import DateOffset
import matplotlib.pyplot as plt

def load_model(model_path):
    model = joblib.load(model_path)
    return model

def preprocess_features(features):
    """Preprocess features by removing the last column for scaling and fitting the scaler."""
    features_to_scale = features[:, :-1]
    scaler = StandardScaler()
    scaler.fit(features_to_scale)
    return scaler

def predict_future(svm_model, X_last, steps_ahead, scaler):
    future_predictions = []
    
    for i in range(steps_ahead):
        X_scaled = scaler.transform(X_last.reshape(1, -1))
        y_future = svm_model.predict(X_scaled)[0]
        
        X_last = np.roll(X_last, -1)
        X_last[-1] = y_future 
        future_predictions.append(y_future)
    
    return future_predictions

def predict_stock(data, steps_ahead=30, model_path="/Users/anubhavkataria/Desktop/Hackathons/IBM_watsonx/ascendio-wealth/python-prediction/SVM_model.joblib"):
    last_adjusted_close = data['Adjusted Close'].iloc[-1]
    data_df = data.drop(data.columns[0], axis=1).reset_index(drop=True)
    
    print("DataFrame columns after dropping the date column:", data_df.columns.tolist())
    
    required_columns = ['Low', 'Open', 'Volume', 'High', 'Close', 'Adjusted Close']
    missing_columns = [col for col in required_columns if col not in data_df.columns]
    
    if missing_columns:
        raise KeyError(f"Missing columns in dataframe: {missing_columns}")

    data_df = data_df[required_columns].values
    # print((data_df),"SIUU")
    
    scaler = preprocess_features(data_df)
    
    svm_model = load_model(model_path)
    
    X_last = data_df[-1, :-1]
    
    future_predictions = predict_future(svm_model, X_last, steps_ahead, scaler)
    future_predictions_np = np.array(future_predictions)

    first_future_pred = future_predictions_np[0]
    diff = last_adjusted_close - first_future_pred
    updated_future_predictions_np =  future_predictions_np + diff

    # print(updated_future_predictions_np,"asdfg")
    
    return updated_future_predictions_np

def plot_values(data, future_steps=30):

    df_subset = data[[data.columns[0], data.columns[-1]]]
    # print(df_subset)

    future_preds = predict_stock(data)
    data['Date'] = pd.to_datetime(data['Date'])
    
    # Get the last known date from the Date column
    last_known_date = data['Date'].iloc[-1]

    # last_known_date = pd.Timestamp.now()  
    future_dates = [last_known_date + DateOffset(days=i) for i in range(1, future_steps + 1)]

    future_df = pd.DataFrame({'Date': future_dates, 'Adjusted Close': future_preds})
    # print("SIUU\n",future_df)

    df_vertical = pd.concat([df_subset, future_df])

    future_df_ver = df_vertical.set_index('Date')
    print("heheh\n",future_df_ver)

    

    plt.figure(figsize=(15, 10))
    plt.plot(future_df_ver.index, future_df_ver['Adjusted Close'], label='Future Predictions', color='green')
    plt.title("SVM Model - Future Predictions")
    plt.xlabel("Date")
    plt.ylabel("Adjusted Close")
    plt.legend()
    plt.grid(True)
    plt.savefig('SVM_future_predictions.png')
    plt.show()

    return np.array(future_preds)



    



# features = pd.DataFrame([
#     ['2024-08-01', 85.32, 85.97, 40500, 86.78, 85.11, 1],
#     ['2024-08-02', 85.11, 85.32, 41000, 86.10, 85.67, 1],
#     ['2024-08-03', 85.30, 85.11, 42000, 85.90, 85.55, 1],
# ], columns=['Date', 'Low', 'Open', 'Volume', 'High', 'Close', 'Adjusted Close'])

# future_steps = 30
# future_predictions = predict_stock(features, steps_ahead=future_steps)
# print((future_predictions))

