# app/utils.py

import yfinance as yf

def get_price_history(symbol: str, range: str):
    range_map = {
        "5d": ("5d", "1d"),       # 1 Week trend = 5 days @ 1-day interval
        "1mo": ("1mo", "1d"),
        "1y": ("1y", "1wk"),
        "5y": ("5y", "1mo"),
        "max": ("max", "1mo"),
    }

    if range not in range_map:
        return {"error": "Invalid range"}

    period, interval = range_map[range]

    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)

        if hist.empty:
            return {"error": f"No data available for {symbol} with {period} and {interval}"}

        hist = hist.reset_index()
        hist["date"] = hist["Date"].dt.strftime(
            "%Y-%m-%d %H:%M" if "h" in interval or "m" in interval else "%Y-%m-%d"
        )

        return {
            "symbol": symbol.upper(),
            "interval": interval,
            "history": hist[["date", "Close"]].rename(columns={"Close": "close"}).to_dict(orient="records")
        }
    except Exception as e:
        return {"error": str(e)}
