# app/routes/history.py

from fastapi import APIRouter, Query
from app.routes.utils import get_price_history

router = APIRouter()

@router.get("/stock/history/{symbol}")
def fetch_history(symbol: str, range: str = Query(None)):
    return get_price_history(symbol.upper(), range)
