from fastapi import APIRouter
import requests

router = APIRouter()

@router.get("/recommendation/{symbol}")
def get_recommendation(symbol: str):
    try:
        pred_res = requests.get(f"http://localhost:8000/api/predictions/{symbol}")
        sent_res = requests.get(f"http://localhost:8000/api/sentiment/{symbol}")

        if pred_res.status_code != 200 or sent_res.status_code != 200:
            return {"error": "Failed to retrieve prediction or sentiment"}

        predictions = pred_res.json()
        sentiment = sent_res.json()

        linear_pred = predictions.get("linear", [])
        if not linear_pred or len(linear_pred) < 2:
            return {"error": "Not enough prediction data"}

        trend_change = linear_pred[-1]["predicted"] - linear_pred[0]["predicted"]
        sentiment_score = sentiment["positive"] - sentiment["negative"]

        if trend_change > 0 and sentiment_score > 0:
            decision = "BUY"
        elif trend_change < 0 and sentiment_score < 0:
            decision = "SELL"
        else:
            decision = "HOLD"

        return {
            "symbol": symbol.upper(),
            "recommendation": decision,
            "trend_change": round(trend_change, 2),
            "sentiment_score": sentiment_score,
            "model_used": "Linear Regression + News Sentiment"
        }

    except Exception as e:
        return {"error": str(e)}
