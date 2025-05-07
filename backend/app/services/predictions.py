import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from statsmodels.tsa.arima.model import ARIMA
from keras.models import Sequential
from keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import datetime

def get_real_predictions(symbol="AAPL"):
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period="5y")  # Use 5 years of data
    close_prices = hist["Close"].dropna().values

    def predict_linear(data):
        df = pd.DataFrame(data, columns=["Close"])
        df["DayOfWeek"] = np.arange(len(df)) % 7
        df["Lag1"] = df["Close"].shift(1)
        df["Lag2"] = df["Close"].shift(2)
        df["RollingMean5"] = df["Close"].rolling(window=5).mean()
        df = df.dropna()

        X = df[["DayOfWeek", "Lag1", "Lag2", "RollingMean5"]]
        y = df["Close"]
        model = LinearRegression()
        model.fit(X, y)
        y_pred = model.predict(X)
        accuracy = r2_score(y, y_pred)

        last_row = df.iloc[-1]
        preds = []
        for i in range(1, 8):
            next_input = np.array([[last_row["DayOfWeek"], last_row["Lag1"], last_row["Lag2"], last_row["RollingMean5"]]])
            next_val = model.predict(next_input)[0]
            preds.append(next_val)
            last_row["Lag2"] = last_row["Lag1"]
            last_row["Lag1"] = next_val
            last_row["RollingMean5"] = (last_row["RollingMean5"] * 4 + next_val) / 5
            last_row["DayOfWeek"] = (last_row["DayOfWeek"] + 1) % 7

        return preds, accuracy

    def predict_arima(data):
        model = ARIMA(data, order=(5, 1, 0))
        model_fit = model.fit()
        preds = model_fit.forecast(steps=7)

        # Use in-sample fitted values to evaluate training performance
        accuracy = r2_score(data, model_fit.fittedvalues)
        return preds, accuracy


    def predict_lstm(data):
        df = pd.DataFrame(data, columns=["Close"])
        df["Lag1"] = df["Close"].shift(1)
        df["Lag2"] = df["Close"].shift(2)
        df["RollingMean5"] = df["Close"].rolling(window=5).mean()
        df = df.dropna()

        features = df[["Lag1", "Lag2", "RollingMean5"]].values
        target = df["Close"].values

        scaler = MinMaxScaler()
        scaled_features = scaler.fit_transform(features)
        scaled_target = scaler.fit_transform(target.reshape(-1, 1)).flatten()

        X, y = [], []
        for i in range(30, len(scaled_features)):
            X.append(scaled_features[i-30:i])
            y.append(scaled_target[i])
        X = np.array(X)
        y = np.array(y)

        model = Sequential()
        model.add(LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], X.shape[2])))
        model.add(LSTM(units=50))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(X, y, epochs=5, batch_size=1, verbose=0)

        # Predict next 7 days using last sequence
        input_seq = X[-1:]
        preds = []
        for _ in range(7):
            pred = model.predict(input_seq, verbose=0)[0][0]
            preds.append(pred)
            new_features = np.append(input_seq[:, 1:, :], [[[pred]*3]], axis=1)
            input_seq = new_features

        preds = scaler.inverse_transform(np.array(preds).reshape(-1, 1)).flatten()
        y_pred = model.predict(X, verbose=0).flatten()
        accuracy = r2_score(y, y_pred)
        return preds, accuracy


    linear, linear_acc = predict_linear(close_prices)
    arima, arima_acc = predict_arima(close_prices)
    lstm, lstm_acc = predict_lstm(close_prices)

    base_date = datetime.date.today()
    dates = [(base_date + datetime.timedelta(days=i)).isoformat() for i in range(1, 8)]

    return {
        "symbol": symbol.upper(),
        "linear": [{"date": d, "predicted": round(float(p), 2)} for d, p in zip(dates, linear)],
        "arima": [{"date": d, "predicted": round(float(p), 2)} for d, p in zip(dates, arima)],
        "lstm": [{"date": d, "predicted": round(float(p), 2)} for d, p in zip(dates, lstm)],
        "linear_accuracy": round(float(linear_acc * 100), 2),
        "arima_accuracy": round(float(arima_acc * 100), 2),
        "lstm_accuracy": round(float(lstm_acc * 100), 2)
    }
