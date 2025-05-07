from fastapi import APIRouter
from textblob import TextBlob # type: ignore
import requests

router = APIRouter()

@router.get("/sentiment/{symbol}")
def analyze_sentiment(symbol: str):
    try:
        response = requests.get(f"http://localhost:8000/api/news", params={"ticker": symbol})
        articles = response.json().get("articles", [])

        pos, neu, neg = 0, 0, 0

        for article in articles:
            title = article.get("title", "")
            if not title:
                continue
            polarity = TextBlob(title).sentiment.polarity
            if polarity > 0.1:
                pos += 1
            elif polarity < -0.1:
                neg += 1
            else:
                neu += 1

        overall = "Positive" if pos > neg else "Negative" if neg > pos else "Neutral"

        return {
            "positive": pos,
            "neutral": neu,
            "negative": neg,
            "overall": overall
        }

    except Exception as e:
        return {"error": str(e)}
