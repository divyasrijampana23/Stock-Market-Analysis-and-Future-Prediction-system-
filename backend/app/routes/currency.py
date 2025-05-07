from fastapi import APIRouter, Query
import requests
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/convert")
def convert_currency(
    from_currency: str = Query(..., min_length=3),
    to_currency: str = Query(..., min_length=3),
    amount: float = Query(..., gt=0)
):
    try:
        from_currency = from_currency.lower()
        to_currency = to_currency.lower()
        today = datetime.utcnow()
        trend = []

        # Fetch trend data for the past 7 days
        for i in range(7):
            date = (today - timedelta(days=i)).strftime('%Y-%m-%d')
            url = f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/currencies/{from_currency}.json"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                rate = data.get(from_currency, {}).get(to_currency)
                if rate:
                    trend.append(round(rate, 4))
                else:
                    trend.append(None)
            else:
                trend.append(None)

        # Reverse trend to have oldest first
        trend = trend[::-1]

        # Fetch latest rate
        latest_url = f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{from_currency}.json"
        latest_response = requests.get(latest_url)
        if latest_response.status_code != 200:
            return {"error": "Failed to fetch latest exchange rate."}
        latest_data = latest_response.json()
        latest_rate = latest_data.get(from_currency, {}).get(to_currency)
        if not latest_rate:
            return {"error": "Exchange rate not available for the given currency pair."}

        converted_amount = round(amount * latest_rate, 2)

        return {
            "from": from_currency.upper(),
            "to": to_currency.upper(),
            "original_amount": amount,
            "converted_amount": converted_amount,
            "rate": latest_rate,
            "trend": trend
        }
    except Exception as e:
        return {"error": str(e)}
