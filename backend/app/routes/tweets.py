# routes/tweets.py
from fastapi import APIRouter # type: ignore
import random

router = APIRouter()

sample_tweets = [
    "Stock {symbol} is looking bullish today.",
    "Investors are cautious about {symbol} this week.",
    "{symbol} has potential to rally next week!",
    "Some analysts downgraded {symbol}, others are hopeful.",
    "Huge volume spike observed in {symbol}.",
    "What's happening with {symbol}? Lots of buzz online.",
    "Traders are talking about {symbol}'s performance lately."
]

@router.get("/tweets/{symbol}")
def get_stock_tweets(symbol: str):
    tweets = [random.choice(sample_tweets).format(symbol=symbol.upper()) for _ in range(7)]
    return {"tweets": tweets}
