import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from math import sqrt
from statsmodels.tsa.arima.model import ARIMA
from keras.models import Sequential # type: ignore
from keras.layers import LSTM, Dense # type: ignore
from sklearn.preprocessing import MinMaxScaler
import datetime

def get_real_predictions(symbol="AAPL"):
    # Fetch historical data
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period="6mo")
    close_prices = hist["Close"].dropna().values

    # Linear Regression
    def predict_linear(data):
        X = np.arange(len(data)).reshape(-1, 1)
        y = data
        model = LinearRegression()
        model.fit(X, y)
        preds = []
        last_idx = len(data)
        for i in range(1, 8):
            pred = model.predict([[last_idx + i]])[0]
            preds.append(pred)
        rmse = sqrt(mean_squared_error(y, model.predict(X)))
        return preds, rmse

    # ARIMA
    def predict_arima(data):
        model = ARIMA(data, order=(5, 1, 0))
        model_fit = model.fit()
        preds = model_fit.forecast(steps=7)
        rmse = sqrt(mean_squared_error(data[-len(preds):], preds))
        return preds, rmse

    # LSTM
    def predict_lstm(data):
        scaler = MinMaxScaler()
        scaled_data = scaler.fit_transform(data.reshape(-1, 1))

        X, y = [], []
        for i in range(30, len(scaled_data)):
            X.append(scaled_data[i-30:i, 0])
            y.append(scaled_data[i, 0])
        X = np.array(X).reshape(-1, 30, 1)
        y = np.array(y)

        model = Sequential()
        model.add(LSTM(units=50, return_sequences=True, input_shape=(30, 1)))
        model.add(LSTM(units=50))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(X, y, epochs=5, batch_size=1, verbose=0)

        input_seq = scaled_data[-30:].reshape(1, 30, 1)
        preds = []
        for _ in range(7):
            pred = model.predict(input_seq, verbose=0)[0][0]
            preds.append(pred)
            input_seq = np.append(input_seq[:, 1:, :], [[[pred]]], axis=1)

        preds = scaler.inverse_transform(np.array(preds).reshape(-1, 1)).flatten()
        rmse = sqrt(mean_squared_error(y, model.predict(X, verbose=0).flatten()))
        return preds, rmse

    linear, linear_rmse = predict_linear(close_prices)
    arima, arima_rmse = predict_arima(close_prices)
    lstm, lstm_rmse = predict_lstm(close_prices)

    base_date = datetime.date.today()
    dates = [(base_date + datetime.timedelta(days=i)).isoformat() for i in range(1, 8)]

    return {
        "symbol": symbol.upper(),
        "linear": [{"date": d, "predicted": round(float(p), 2)} for d, p in zip(dates, linear)],
        "arima": [{"date": d, "predicted": round(float(p), 2)} for d, p in zip(dates, arima)],
        "lstm": [{"date": d, "predicted": round(float(p), 2)} for d, p in zip(dates, lstm)],
        "linear_rmse": round(float(linear_rmse), 2),
        "arima_rmse": round(float(arima_rmse), 2),
        "lstm_rmse": round(float(lstm_rmse), 2)
}

