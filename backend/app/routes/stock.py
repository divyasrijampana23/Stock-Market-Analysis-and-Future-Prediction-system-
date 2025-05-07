from fastapi import APIRouter, Query # type: ignore
from typing import List
import yfinance as yf
import numpy as np

router = APIRouter()

def clean_float(val):
    if val is None or (isinstance(val, float) and (np.isnan(val) or np.isinf(val))):
        return None
    return round(val, 2)

@router.get("/details")
def get_stock_details(tickers: List[str] = Query(...)):
    result = []

    for symbol in tickers:
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="1d", interval="1m")
            info = stock.info

            # Return even if some values are missing, so frontend is safe
            data = {
                "symbol": symbol,
                "price": clean_float(info.get("regularMarketPrice")),
                "change": clean_float(info.get("regularMarketChange")),
                "percent_change": clean_float(info.get("regularMarketChangePercent")),
                "open": clean_float(info.get("regularMarketOpen")),
                "high": clean_float(info.get("regularMarketDayHigh")),
                "low": clean_float(info.get("regularMarketDayLow")),
                "previous_close": clean_float(info.get("regularMarketPreviousClose")),
                "timestamp": str(hist.index[-1]) if not hist.empty else None,
                "history": [round(float(p), 2) for p in hist["Close"].tail(10).values] if not hist.empty else [],
            }

            result.append(data)

        except Exception as e:
            result.append({
                "symbol": symbol,
                "price": None,
                "change": None,
                "percent_change": None,
                "open": None,
                "high": None,
                "low": None,
                "previous_close": None,
                "timestamp": None,
                "history": [],
                "error": str(e)
            })

    return result
